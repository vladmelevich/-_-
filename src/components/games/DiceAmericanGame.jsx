import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { log, logError, logAction, validateAndLog } from '../../utils/devMode.js';

function DiceAmericanGame({ rounds, onRoundFinish, onGameFinish, isBotGame }) {
  // Валидация пропсов
  useEffect(() => {
    const validation = validateAndLog(
      { rounds, isBotGame },
      {
        rounds: { required: true, type: 'number', min: 1 },
        isBotGame: { required: false, type: 'boolean' }
      },
      'DiceAmericanGame props'
    );
    
    if (!validation.valid) {
      logError('validation', 'Неверные пропсы DiceAmericanGame', validation.errors);
    } else {
      log('component', 'DiceAmericanGame инициализирован', { rounds, isBotGame });
    }
  }, []);
  
  const [currentRound, setCurrentRound] = useState(1);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [playerDice, setPlayerDice] = useState([0, 0, 0]);
  const [opponentDice, setOpponentDice] = useState([0, 0, 0]);
  const [playerPoints, setPlayerPoints] = useState(0);
  const [opponentPoints, setOpponentPoints] = useState(0);
  const [playerRerolls, setPlayerRerolls] = useState(2);
  const [opponentRerolls, setOpponentRerolls] = useState(2);
  const [isRolling, setIsRolling] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [opponentReady, setOpponentReady] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isProcessingRerolls, setIsProcessingRerolls] = useState(false);
  const processingRef = useRef(false);
  const checkRoundFinishCalledRef = useRef(false);

  const rollDice = () => Math.floor(Math.random() * 6) + 1;

  const checkSpecial = (dice) => {
    const sorted = [...dice].sort((a, b) => a - b);
    if (sorted[0] === 1 && sorted[1] === 2 && sorted[2] === 3) return 'lose-all';
    if (sorted[0] === 4 && sorted[1] === 5 && sorted[2] === 6) return 'win-all';
    return null;
  };

  const calculatePoints = (dice) => {
    const counts = {};
    dice.forEach(d => { counts[d] = (counts[d] || 0) + 1; });
    
    const values = Object.values(counts);
    if (values.includes(3)) return 'three-of-a-kind';
    if (values.includes(2)) {
      const singleValue = Object.keys(counts).find(k => counts[k] === 1);
      return parseInt(singleValue);
    }
    return 0;
  };

  const canReroll = (dice) => {
    if (dice[0] === 0 || dice.length !== 3) return false;
    const sorted = [...dice].sort((a, b) => a - b);
    if ((sorted[0] === 1 && sorted[1] === 2 && sorted[2] === 3) ||
        (sorted[0] === 4 && sorted[1] === 5 && sorted[2] === 6)) return false;
    return new Set(dice).size === 3;
  };

  const startRound = () => {
    if (isBlocked || isRolling || isProcessingRerolls || processingRef.current || currentRound > rounds) return;
    
    processingRef.current = true;
    checkRoundFinishCalledRef.current = false;
    setIsRolling(true);
    setPlayerReady(false);
    setOpponentReady(false);
    setIsProcessingRerolls(false);
    
    const roundNumber = currentRound;
    const playerRolls = [rollDice(), rollDice(), rollDice()];
    const opponentRolls = [rollDice(), rollDice(), rollDice()];
    
    setPlayerDice(playerRolls);
    setOpponentDice(opponentRolls);
    setPlayerRerolls(2);
    setOpponentRerolls(2);
    
    setTimeout(() => {
      if (isBlocked) {
        processingRef.current = false;
        return;
      }
      
      setIsRolling(false);
      
      const playerSpecial = checkSpecial(playerRolls);
      const opponentSpecial = checkSpecial(opponentRolls);
      
      if (playerSpecial === 'lose-all' || opponentSpecial === 'win-all') {
        setGameOver(true);
        setIsBlocked(true);
        processingRef.current = false;
        setTimeout(() => {
          if (onGameFinish) onGameFinish(false);
        }, 2000);
        return;
      }
      
      if (playerSpecial === 'win-all' || opponentSpecial === 'lose-all') {
        setGameOver(true);
        setIsBlocked(true);
        processingRef.current = false;
        setTimeout(() => {
          if (onGameFinish) onGameFinish(true);
        }, 2000);
        return;
      }
      
      const playerPts = calculatePoints(playerRolls);
      const opponentPts = calculatePoints(opponentRolls);
      
      setPlayerPoints(typeof playerPts === 'number' ? playerPts : 0);
      setOpponentPoints(typeof opponentPts === 'number' ? opponentPts : 0);
      
      // Автоматические перебросы для игрока
      setTimeout(() => {
        if (!isBlocked) {
          processPlayerRerolls(playerRolls, playerPts, 2);
        }
      }, 500);
      
      // Симуляция перебросов соперника (бот)
      if (isBotGame) {
        setTimeout(() => {
          if (isBlocked) {
            processingRef.current = false;
            return;
          }
          
          let oppDice = [...opponentRolls];
          let oppRerolls = 2;
          
          const processBotRerolls = () => {
            if (isBlocked) return;
            
            if (oppRerolls > 0 && canReroll(oppDice)) {
              const newRolls = [rollDice(), rollDice(), rollDice()];
              const newPts = calculatePoints(newRolls);
              oppDice = newRolls;
              oppRerolls--;
              
              if (typeof newPts === 'number' && newPts > 0 || newPts === 'three-of-a-kind') {
                setOpponentDice(oppDice);
                setOpponentRerolls(oppRerolls);
                setOpponentPoints(typeof newPts === 'number' ? newPts : 0);
                
                setTimeout(() => {
                  if (!isBlocked) {
                    setOpponentReady(true);
                    logAction('botReady', { dice: oppDice, points: newPts });
                  }
                }, 1000);
              } else if (oppRerolls > 0 && canReroll(oppDice)) {
                setTimeout(processBotRerolls, 1500);
              } else {
                setOpponentDice(oppDice);
                setOpponentRerolls(oppRerolls);
                setOpponentPoints(typeof newPts === 'number' ? newPts : 0);
                
                setTimeout(() => {
                  if (!isBlocked) {
                    setOpponentReady(true);
                    logAction('botReady', { dice: oppDice, points: newPts });
                  }
                }, 1000);
              }
            } else {
              setOpponentDice(oppDice);
              setOpponentRerolls(oppRerolls);
              const oppPts = calculatePoints(oppDice);
              setOpponentPoints(typeof oppPts === 'number' ? oppPts : 0);
              
              setTimeout(() => {
                if (!isBlocked) {
                  setOpponentReady(true);
                  logAction('botReady', { dice: oppDice, points: oppPts });
                }
              }, 1000);
            }
          };
          
          processBotRerolls();
        }, 1500);
      } else {
        setTimeout(() => {
          if (!isBlocked) {
            processingRef.current = false;
          }
        }, 500);
      }
    }, 1000);
  };

  const processPlayerRerolls = (initialDice, initialPts, rerollsLeft) => {
    if (isBlocked) {
      setIsProcessingRerolls(false);
      processingRef.current = false;
      return;
    }
    
    if ((typeof initialPts === 'number' && initialPts > 0) || 
        initialPts === 'three-of-a-kind' || 
        !canReroll(initialDice) || 
        rerollsLeft === 0) {
      setTimeout(() => {
        if (!isBlocked) {
          setPlayerReady(true);
          logAction('playerAutoReady', { dice: initialDice, points: initialPts });
          setIsProcessingRerolls(false);
          processingRef.current = false;
        }
      }, 1000);
      return;
    }
    
    setIsProcessingRerolls(true);
    
    setTimeout(() => {
      if (isBlocked) {
        setIsProcessingRerolls(false);
        processingRef.current = false;
        return;
      }
      
      setIsRolling(true);
      const newRolls = [rollDice(), rollDice(), rollDice()];
      const newPts = calculatePoints(newRolls);
      
      setTimeout(() => {
        if (isBlocked) {
          setIsProcessingRerolls(false);
          processingRef.current = false;
          return;
        }
        
        setIsRolling(false);
        setPlayerDice(newRolls);
        setPlayerRerolls(rerollsLeft - 1);
        setPlayerPoints(typeof newPts === 'number' ? newPts : 0);
        
        if ((typeof newPts === 'number' && newPts > 0) || 
            newPts === 'three-of-a-kind' || 
            !canReroll(newRolls) || 
            rerollsLeft - 1 === 0) {
          setTimeout(() => {
            if (!isBlocked) {
              setPlayerReady(true);
              logAction('playerAutoReady', { dice: newRolls, points: newPts });
              setIsProcessingRerolls(false);
              processingRef.current = false;
            }
          }, 1000);
        } else {
          processPlayerRerolls(newRolls, newPts, rerollsLeft - 1);
        }
      }, 1000);
    }, 1000);
  };

  const checkRoundFinish = () => {
    if (!playerReady || !opponentReady || isBlocked || processingRef.current || checkRoundFinishCalledRef.current) return;
    
    checkRoundFinishCalledRef.current = true;
    processingRef.current = true;
    
    const playerPts = calculatePoints(playerDice);
    const opponentPts = calculatePoints(opponentDice);
    
    let roundWinner = null;
    const playerThree = playerPts === 'three-of-a-kind';
    const opponentThree = opponentPts === 'three-of-a-kind';
    
    if (playerThree && !opponentThree) {
      roundWinner = true;
    } else if (opponentThree && !playerThree) {
      roundWinner = false;
    } else if (playerThree && opponentThree) {
      const playerSum = playerDice.reduce((a, b) => a + b, 0);
      const opponentSum = opponentDice.reduce((a, b) => a + b, 0);
      if (playerSum > opponentSum) {
        roundWinner = true;
      } else if (opponentSum > playerSum) {
        roundWinner = false;
      }
    } else if (typeof playerPts === 'number' && typeof opponentPts === 'number') {
      if (playerPts > opponentPts) {
        roundWinner = true;
      } else if (opponentPts > playerPts) {
        roundWinner = false;
      }
    }
    
    const roundNumber = currentRound;
    
    logAction('roundFinished', { roundWinner, playerPts, opponentPts, currentRound: roundNumber });
    
    // Обновляем счет только один раз
    if (roundWinner === true) {
      setPlayerScore(prev => prev + 1);
    } else if (roundWinner === false) {
      setOpponentScore(prev => prev + 1);
    }
    
    // Проверяем условия завершения игры и переход к следующему раунду с задержкой, используя функциональные обновления
    setTimeout(() => {
      if (isBlocked) {
        processingRef.current = false;
        checkRoundFinishCalledRef.current = false;
        return;
      }
      
      setPlayerScore(prevPlayer => {
        setOpponentScore(prevOpponent => {
          const halfRounds = Math.ceil(rounds / 2);
          
          if (prevPlayer > halfRounds) {
            setIsBlocked(true);
            processingRef.current = false;
            checkRoundFinishCalledRef.current = false;
            setTimeout(() => {
              if (onGameFinish) onGameFinish(true);
            }, 2000);
            return prevOpponent;
          }
          
          if (prevOpponent > halfRounds) {
            setIsBlocked(true);
            processingRef.current = false;
            checkRoundFinishCalledRef.current = false;
            setTimeout(() => {
              if (onGameFinish) onGameFinish(false);
            }, 2000);
            return prevOpponent;
          }
          
          // Переход к следующему раунду (даже при ничьей) с задержкой
          if (roundNumber < rounds) {
            setTimeout(() => {
              if (onRoundFinish) onRoundFinish(roundNumber, roundWinner);
              setCurrentRound(roundNumber + 1);
              processingRef.current = false;
              checkRoundFinishCalledRef.current = false;
            }, 2000);
          } else {
            setIsBlocked(true);
            processingRef.current = false;
            checkRoundFinishCalledRef.current = false;
            const isWinner = prevPlayer > prevOpponent;
            setTimeout(() => {
              if (onGameFinish) onGameFinish(isWinner);
            }, 2000);
          }
          
          return prevOpponent;
        });
        return prevPlayer;
      });
    }, 1500);
  };

  useEffect(() => {
    if (playerReady && opponentReady && !isBlocked && !isProcessingRerolls && !processingRef.current && currentRound <= rounds && !checkRoundFinishCalledRef.current) {
      checkRoundFinish();
    }
  }, [playerReady, opponentReady, isBlocked, isProcessingRerolls, currentRound, rounds]);

  // Сброс кубиков при новом раунде
  useEffect(() => {
    if (currentRound <= rounds && !isBlocked && rounds > 0 && currentRound >= 1) {
      setPlayerDice([0, 0, 0]);
      setOpponentDice([0, 0, 0]);
      setPlayerPoints(0);
      setOpponentPoints(0);
      setPlayerRerolls(2);
      setOpponentRerolls(2);
      setIsRolling(false);
      setPlayerReady(false);
      setOpponentReady(false);
      setGameOver(false);
      setIsProcessingRerolls(false);
      processingRef.current = false;
      checkRoundFinishCalledRef.current = false;
    }
  }, [currentRound, rounds, isBlocked]);
  
  // Автоматический запуск раунда
  useEffect(() => {
    if (currentRound <= rounds && !isBlocked && playerDice[0] === 0 && rounds > 0 && !isRolling && !isProcessingRerolls && !processingRef.current && currentRound >= 1) {
      const timer = setTimeout(() => {
        if (!isBlocked && playerDice[0] === 0 && !isRolling && !isProcessingRerolls && !processingRef.current && currentRound <= rounds && currentRound >= 1) {
          startRound();
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentRound, rounds, isBlocked, playerDice, isRolling, isProcessingRerolls]);

  return (
    <div className="dice-american-game">
      <div className="game-score">
        <div className="score-item">
          <span>Вы: {playerScore}</span>
        </div>
        <div className="score-item">
          <span>Раунд {Math.min(Math.max(currentRound, 1), rounds)}/{rounds}</span>
        </div>
        <div className="score-item">
          <span>Соперник: {opponentScore}</span>
        </div>
      </div>
      
      {gameOver && (
        <div className="game-over-message">
          {playerScore > opponentScore ? 'Вы выиграли все раунды!' : 'Вы проиграли все раунды!'}
        </div>
      )}
      
      <div className="dice-container">
        <div className="dice-player">
          <h3>Ваши кубики</h3>
          <div className="dice-row">
            {playerDice.map((dice, i) => (
              <div key={i} className={`dice ${isRolling ? 'dice--rolling' : ''}`}>
                {dice || '?'}
              </div>
            ))}
          </div>
          <div className="dice-info">
            <div>Очки: {typeof playerPoints === 'number' ? playerPoints : playerPoints === 'three-of-a-kind' ? 'Три одинаковых!' : playerPoints}</div>
            <div>Перебросов: {playerRerolls}</div>
            {playerReady && <div className="ready-indicator">✓ Готов</div>}
          </div>
        </div>
        
        <div className="dice-player">
          <h3>Кубики соперника</h3>
          <div className="dice-row">
            {opponentDice.map((dice, i) => (
              <div key={i} className={`dice ${isRolling ? 'dice--rolling' : ''}`}>
                {dice || '?'}
              </div>
            ))}
          </div>
          <div className="dice-info">
            <div>Очки: {typeof opponentPoints === 'number' ? opponentPoints : opponentPoints === 'three-of-a-kind' ? 'Три одинаковых!' : opponentPoints}</div>
            {opponentReady && <div className="ready-indicator">✓ Готов</div>}
          </div>
        </div>
      </div>
      
      {(isRolling || isProcessingRerolls) && (
        <div className="game-status">
          {isProcessingRerolls ? 'Автоматические перебросы...' : 'Бросаем кубики...'}
        </div>
      )}
      
      {playerReady && !opponentReady && !isBlocked && (
        <div className="game-status">Ожидание соперника...</div>
      )}
      
      {playerReady && opponentReady && !isBlocked && (
        <div className="game-status">Определение победителя раунда...</div>
      )}
    </div>
  );
}

DiceAmericanGame.propTypes = {
  rounds: PropTypes.number.isRequired,
  onRoundFinish: PropTypes.func,
  onGameFinish: PropTypes.func.isRequired,
  isBotGame: PropTypes.bool
};

export default DiceAmericanGame;
