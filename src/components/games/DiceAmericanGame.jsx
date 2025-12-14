import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { log, logError, logAction, validateAndLog } from '../../utils/devMode.js';

// Компонент 3D кубика с точками
const Dice3D = ({ value, isRolling, delay = 0 }) => {
  const dots = {
    1: [[50, 50]],
    2: [[25, 25], [75, 75]],
    3: [[25, 25], [50, 50], [75, 75]],
    4: [[25, 25], [75, 25], [25, 75], [75, 75]],
    5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
    6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]]
  };
  
  const currentDots = value && value !== '?' ? dots[value] || [] : [];
  
  return (
    <div 
      className={`dice-3d ${isRolling ? 'dice-3d--rolling' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="dice-3d-inner">
        <div className="dice-3d-face dice-3d-face--front">
          {value === '?' ? (
            <span className="dice-3d-question">?</span>
          ) : (
            <div className="dice-3d-dots">
              {currentDots.map((dot, i) => (
                <div 
                  key={i} 
                  className="dice-3d-dot"
                  style={{ left: `${dot[0]}%`, top: `${dot[1]}%` }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function DiceAmericanGame({ rounds, onRoundFinish, onGameFinish, isBotGame }) {
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
  const [gameOverWinner, setGameOverWinner] = useState(null);
  const [roundTied, setRoundTied] = useState(false);
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

  const getPointsLabel = (points) => {
    if (points === 'three-of-a-kind') return '🎲 Три одинаковых!';
    if (points === 0) return 'Нет комбинации';
    return `Пара + ${points}`;
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
        setGameOverWinner(false);
        setIsBlocked(true);
        processingRef.current = false;
        setTimeout(() => {
          if (onGameFinish) onGameFinish(false);
        }, 2000);
        return;
      }
      
      if (playerSpecial === 'win-all' || opponentSpecial === 'lose-all') {
        setGameOver(true);
        setGameOverWinner(true);
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
      
      setTimeout(() => {
        if (!isBlocked) {
          setPlayerDice(playerRolls);
          setOpponentDice(opponentRolls);
          processPlayerRerolls(playerRolls, playerPts, 2);
        }
      }, 2000);
      
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
              setOpponentDice(['?', '?', '?']);
              setIsRolling(true);
              
              setTimeout(() => {
                if (isBlocked) return;
                
                const newRolls = [rollDice(), rollDice(), rollDice()];
                const newPts = calculatePoints(newRolls);
                oppDice = newRolls;
                oppRerolls--;
                
                setTimeout(() => {
                  if (isBlocked) return;
                  
                  setIsRolling(false);
                  
                  if (typeof newPts === 'number' && newPts > 0 || newPts === 'three-of-a-kind') {
                    setOpponentDice(oppDice);
                    setOpponentRerolls(oppRerolls);
                    setOpponentPoints(typeof newPts === 'number' ? newPts : 0);
                    
                    setTimeout(() => {
                      if (!isBlocked) {
                        setOpponentReady(true);
                        logAction('botReady', { dice: oppDice, points: newPts });
                      }
                    }, 1500);
                  } else if (oppRerolls > 0 && canReroll(oppDice)) {
                    setOpponentDice(oppDice);
                    setOpponentRerolls(oppRerolls);
                    setOpponentPoints(typeof newPts === 'number' ? newPts : 0);
                    setTimeout(processBotRerolls, 2000);
                  } else {
                    setOpponentDice(oppDice);
                    setOpponentRerolls(oppRerolls);
                    setOpponentPoints(typeof newPts === 'number' ? newPts : 0);
                    
                    setTimeout(() => {
                      if (!isBlocked) {
                        setOpponentReady(true);
                        logAction('botReady', { dice: oppDice, points: newPts });
                      }
                    }, 1500);
                  }
                }, 1000);
              }, 1000);
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
              }, 1500);
            }
          };
          
          processBotRerolls();
        }, 2000);
      } else {
        setTimeout(() => {
          if (!isBlocked) {
            processingRef.current = false;
          }
        }, 1500);
      }
    }, 2000);
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
      setPlayerDice(['?', '?', '?']);
      
      setTimeout(() => {
        if (isBlocked) {
          setIsProcessingRerolls(false);
          processingRef.current = false;
          return;
        }
        
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
      }, 1500);
    }, 1500);
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
    
    // 65% шанс проиграть, 35% шанс выиграть
    let finalRoundWinner = roundWinner;
    if (roundWinner !== null) {
      const randomChance = Math.random();
      const shouldWin = randomChance < 0.35;
      finalRoundWinner = shouldWin ? roundWinner : !roundWinner;
    }
    
    logAction('roundFinished', { roundWinner: finalRoundWinner, playerPts, opponentPts, currentRound: roundNumber });
    
    if (finalRoundWinner === null) {
      setRoundTied(true);
    } else if (finalRoundWinner === true) {
      setPlayerScore(prev => prev + 1);
    } else if (finalRoundWinner === false) {
      setOpponentScore(prev => prev + 1);
    }
    
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
          
          if (finalRoundWinner === null) {
            setTimeout(() => {
              if (isBlocked) {
                processingRef.current = false;
                checkRoundFinishCalledRef.current = false;
                return;
              }
              setRoundTied(false);
              if (onRoundFinish) {
                onRoundFinish(roundNumber, null);
              }
              setPlayerDice([0, 0, 0]);
              setOpponentDice([0, 0, 0]);
              setPlayerPoints(0);
              setOpponentPoints(0);
              setPlayerRerolls(2);
              setOpponentRerolls(2);
              setIsRolling(false);
              setPlayerReady(false);
              setOpponentReady(false);
              setIsProcessingRerolls(false);
              processingRef.current = false;
              checkRoundFinishCalledRef.current = false;
            }, 2000);
          } else if (roundNumber < rounds) {
            setTimeout(() => {
              if (isBlocked) {
                processingRef.current = false;
                checkRoundFinishCalledRef.current = false;
                return;
              }
              if (onRoundFinish) {
                onRoundFinish(roundNumber, finalRoundWinner);
              }
              setPlayerDice([0, 0, 0]);
              setOpponentDice([0, 0, 0]);
              setPlayerPoints(0);
              setOpponentPoints(0);
              setPlayerRerolls(2);
              setOpponentRerolls(2);
              setIsRolling(false);
              setPlayerReady(false);
              setOpponentReady(false);
              setIsProcessingRerolls(false);
              processingRef.current = false;
              checkRoundFinishCalledRef.current = false;
              setCurrentRound(roundNumber + 1);
            }, 3000);
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
      setGameOverWinner(null);
      setRoundTied(false);
      setIsProcessingRerolls(false);
      processingRef.current = false;
      checkRoundFinishCalledRef.current = false;
    }
  }, [currentRound, rounds, isBlocked]);
  
  useEffect(() => {
    if (currentRound <= rounds && !isBlocked && playerDice[0] === 0 && rounds > 0 && !isRolling && !isProcessingRerolls && !processingRef.current && currentRound >= 1) {
      const timer = setTimeout(() => {
        if (!isBlocked && playerDice[0] === 0 && !isRolling && !isProcessingRerolls && !processingRef.current && currentRound <= rounds && currentRound >= 1) {
          startRound();
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentRound, rounds, isBlocked, playerDice, isRolling, isProcessingRerolls]);

  return (
    <div className="dice-american-game">
      {/* Фоновый паттерн */}
      <div className="dice-american-bg"></div>
      
      {/* Заголовок со счётом */}
      <div className="dice-american-header">
        <div className="dice-american-score-panel">
          <div className="dice-american-score dice-american-score--player">
            <span className="dice-american-score-emoji">🎲</span>
            <span className="dice-american-score-label">Вы</span>
            <span className="dice-american-score-value">{playerScore}</span>
          </div>
          <div className="dice-american-round-info">
            <span className="dice-american-round-label">Раунд</span>
            <span className="dice-american-round-value">{Math.min(Math.max(currentRound, 1), rounds)}/{rounds}</span>
          </div>
          <div className="dice-american-score dice-american-score--opponent">
            <span className="dice-american-score-emoji">🤖</span>
            <span className="dice-american-score-label">Соперник</span>
            <span className="dice-american-score-value">{opponentScore}</span>
          </div>
        </div>
      </div>
      
      {/* Уведомления */}
      {roundTied && (
        <div className="dice-american-notification dice-american-notification--tie">
          <span className="dice-american-notification-icon">🤝</span>
          <span>Ничья! Раунд переигрывается...</span>
        </div>
      )}
      
      {gameOver && (
        <div className={`dice-american-notification ${gameOverWinner ? 'dice-american-notification--win' : 'dice-american-notification--lose'}`}>
          <span className="dice-american-notification-icon">{gameOverWinner ? '🏆' : '💔'}</span>
          <span>{gameOverWinner ? 'Вы выиграли все раунды!' : 'Вы проиграли все раунды!'}</span>
        </div>
      )}
      
      {/* Игровое поле */}
      <div className="dice-american-arena">
        {/* Карточка игрока */}
        <div className="dice-american-player-card dice-american-player-card--player">
          <div className="dice-american-player-header">
            <h3>🎯 Ваши кубики</h3>
            {playerReady && (
              <span className="dice-american-ready-badge">✓ Готов</span>
            )}
          </div>
          <div className="dice-american-dice-row">
            {playerDice.map((dice, i) => (
              <Dice3D key={i} value={dice} isRolling={isRolling} delay={i * 100} />
            ))}
          </div>
          <div className="dice-american-stats">
            <div className="dice-american-stat">
              <span className="dice-american-stat-label">Комбинация</span>
              <span className={`dice-american-stat-value ${playerPoints === 'three-of-a-kind' || (typeof playerPoints === 'number' && playerPoints > 0) ? 'dice-american-stat-value--good' : ''}`}>
                {getPointsLabel(calculatePoints(playerDice))}
              </span>
            </div>
            <div className="dice-american-stat">
              <span className="dice-american-stat-label">Перебросов</span>
              <span className="dice-american-stat-value">{playerRerolls}</span>
            </div>
          </div>
        </div>
        
        {/* Разделитель VS */}
        <div className="dice-american-vs">
          <span>VS</span>
        </div>
        
        {/* Карточка соперника */}
        <div className="dice-american-player-card dice-american-player-card--opponent">
          <div className="dice-american-player-header">
            <h3>🤖 Кубики соперника</h3>
            {opponentReady && (
              <span className="dice-american-ready-badge">✓ Готов</span>
            )}
          </div>
          <div className="dice-american-dice-row">
            {opponentDice.map((dice, i) => (
              <Dice3D key={i} value={dice} isRolling={isRolling} delay={i * 100 + 50} />
            ))}
          </div>
          <div className="dice-american-stats">
            <div className="dice-american-stat">
              <span className="dice-american-stat-label">Комбинация</span>
              <span className={`dice-american-stat-value ${opponentPoints === 'three-of-a-kind' || (typeof opponentPoints === 'number' && opponentPoints > 0) ? 'dice-american-stat-value--good' : ''}`}>
                {getPointsLabel(calculatePoints(opponentDice))}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Статус игры */}
      {(isRolling || isProcessingRerolls) && (
        <div className="dice-american-status">
          <div className="dice-american-spinner"></div>
          <span>{isProcessingRerolls ? 'Автоматические перебросы...' : 'Бросаем кубики...'}</span>
        </div>
      )}
      
      {playerReady && !opponentReady && !isBlocked && (
        <div className="dice-american-status">
          <div className="dice-american-spinner"></div>
          <span>Ожидание соперника...</span>
        </div>
      )}
      
      {playerReady && opponentReady && !isBlocked && (
        <div className="dice-american-status dice-american-status--result">
          <span>🎯 Определение победителя раунда...</span>
        </div>
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
