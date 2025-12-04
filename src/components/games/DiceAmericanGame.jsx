import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

function DiceAmericanGame({ rounds, onRoundFinish, onGameFinish }) {
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
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState(null); // 'win-all', 'lose-all', null
  const [isBlocked, setIsBlocked] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [opponentReady, setOpponentReady] = useState(false);

  const rollDice = () => {
    return Math.floor(Math.random() * 6) + 1;
  };

  const checkSpecialCombination = (dice) => {
    const sorted = [...dice].sort((a, b) => a - b);
    
    // Проверка на 1, 2, 3 (проигрыш всех раундов)
    if (sorted[0] === 1 && sorted[1] === 2 && sorted[2] === 3) {
      return 'lose-all';
    }
    
    // Проверка на 4, 5, 6 (выигрыш всех раундов)
    if (sorted[0] === 4 && sorted[1] === 5 && sorted[2] === 6) {
      return 'win-all';
    }
    
    return null;
  };

  const calculatePoints = (dice) => {
    const counts = {};
    dice.forEach(d => {
      counts[d] = (counts[d] || 0) + 1;
    });
    
    const values = Object.values(counts);
    
    // Три одинаковых
    if (values.includes(3)) {
      return 'three-of-a-kind'; // Специальный маркер для трех одинаковых
    }
    
    // Пара + значение
    if (values.includes(2)) {
      const pairValue = Object.keys(counts).find(k => counts[k] === 2);
      const singleValue = Object.keys(counts).find(k => counts[k] === 1);
      return parseInt(singleValue);
    }
    
    // Три разных (не 1,2,3 и не 4,5,6)
    return 0;
  };

  // Проверка, можно ли перебросить кубики
  const canReroll = (dice) => {
    if (dice.length !== 3 || dice[0] === 0) return false;
    
    const sorted = [...dice].sort((a, b) => a - b);
    
    // Нельзя перебросить, если 1,2,3 или 4,5,6
    if ((sorted[0] === 1 && sorted[1] === 2 && sorted[2] === 3) ||
        (sorted[0] === 4 && sorted[1] === 5 && sorted[2] === 6)) {
      return false;
    }
    
    // Можно перебросить только если все числа разные
    const unique = new Set(dice);
    return unique.size === 3;
  };

  const handleRoll = useCallback(() => {
    if (isRolling || gameOver || isBlocked) return;
    
    setIsRolling(true);
    
    const playerRolls = [rollDice(), rollDice(), rollDice()];
    const opponentRolls = [rollDice(), rollDice(), rollDice()];
    
    setPlayerDice(playerRolls);
    setOpponentDice(opponentRolls);
    
    setTimeout(() => {
      setIsRolling(false);
      
      // Проверка специальных комбинаций
      const playerSpecial = checkSpecialCombination(playerRolls);
      const opponentSpecial = checkSpecialCombination(opponentRolls);
      
      if (playerSpecial === 'lose-all' || opponentSpecial === 'win-all') {
        setGameOver(true);
        setGameResult(false);
        setIsBlocked(true);
        setTimeout(() => {
          if (onGameFinish) onGameFinish(false);
        }, 1000);
        return;
      }
      
      if (playerSpecial === 'win-all' || opponentSpecial === 'lose-all') {
        setGameOver(true);
        setGameResult(true);
        setIsBlocked(true);
        setTimeout(() => {
          if (onGameFinish) onGameFinish(true);
        }, 1000);
        return;
      }
      
      // Подсчет очков
      const playerPts = calculatePoints(playerRolls);
      const opponentPts = calculatePoints(opponentRolls);
      
      setPlayerPoints(typeof playerPts === 'number' ? playerPts : 0);
      setOpponentPoints(typeof opponentPts === 'number' ? opponentPts : 0);
      
      // Сбрасываем готовность игроков
      setPlayerReady(false);
      setOpponentReady(false);
      
      let newPlayerScore = playerScore;
      let newOpponentScore = opponentScore;
      
      // Проверка на три одинаковых
      const playerThreeKind = playerPts === 'three-of-a-kind';
      const opponentThreeKind = opponentPts === 'three-of-a-kind';
      
      // Если у игрока три одинаковых, а у соперника нет - победа игрока
      if (playerThreeKind && !opponentThreeKind) {
        newPlayerScore = playerScore + 1;
        setPlayerScore(newPlayerScore);
      }
      // Если у соперника три одинаковых, а у игрока нет - победа соперника
      else if (opponentThreeKind && !playerThreeKind) {
        newOpponentScore = opponentScore + 1;
        setOpponentScore(newOpponentScore);
      }
      // Если у обоих три одинаковых, сравниваем суммы
      else if (playerThreeKind && opponentThreeKind) {
        const playerSum = playerRolls.reduce((a, b) => a + b, 0);
        const opponentSum = opponentRolls.reduce((a, b) => a + b, 0);
        
        if (playerSum > opponentSum) {
          newPlayerScore = playerScore + 1;
          setPlayerScore(newPlayerScore);
        } else if (opponentSum > playerSum) {
          newOpponentScore = opponentScore + 1;
          setOpponentScore(newOpponentScore);
        }
      }
      // Если у обоих не три одинаковых, сравниваем очки
      else if (typeof playerPts === 'number' && typeof opponentPts === 'number') {
        if (playerPts > opponentPts) {
          newPlayerScore = playerScore + 1;
          setPlayerScore(newPlayerScore);
        } else if (opponentPts > playerPts) {
          newOpponentScore = opponentScore + 1;
          setOpponentScore(newOpponentScore);
        }
      }
      
      // Проверка на автопроигрыш (> 50% раундов)
      const totalRounds = rounds;
      const halfRounds = Math.ceil(totalRounds / 2);
      
      if (newPlayerScore > halfRounds) {
        setIsBlocked(true);
        setTimeout(() => {
          if (onGameFinish) onGameFinish(true);
        }, 2000);
        return;
      }
      
      if (newOpponentScore > halfRounds) {
        setIsBlocked(true);
        setTimeout(() => {
          if (onGameFinish) onGameFinish(false);
        }, 2000);
        return;
      }
      
      // Определяем победителя раунда
      let roundWinner = null;
      if (playerThreeKind && !opponentThreeKind) {
        roundWinner = true;
      } else if (opponentThreeKind && !playerThreeKind) {
        roundWinner = false;
      } else if (playerThreeKind && opponentThreeKind) {
        const playerSum = playerRolls.reduce((a, b) => a + b, 0);
        const opponentSum = opponentRolls.reduce((a, b) => a + b, 0);
        roundWinner = playerSum > opponentSum;
      } else if (typeof playerPts === 'number' && typeof opponentPts === 'number') {
        roundWinner = playerPts > opponentPts;
      }
      
      // Не переходим автоматически - ждем готовности обоих игроков
    }, 800);
  }, [isRolling, gameOver, isBlocked, playerScore, opponentScore, rounds, onRoundFinish, onGameFinish]);

  // Сброс состояния при переходе к новому раунду
  useEffect(() => {
    if (currentRound <= rounds) {
      setPlayerDice([0, 0, 0]);
      setOpponentDice([0, 0, 0]);
      setPlayerPoints(0);
      setOpponentPoints(0);
      setPlayerRerolls(2);
      setOpponentRerolls(2);
      setIsRolling(false);
      setGameOver(false);
      setGameResult(null);
      setPlayerReady(false);
      setOpponentReady(false);
    }
  }, [currentRound]);

  // Автоматический запуск раунда
  useEffect(() => {
    if (!isBlocked && currentRound <= rounds && !isRolling && !gameOver && playerDice[0] === 0) {
      const timer = setTimeout(() => {
        if (!isRolling && !isBlocked && !gameOver) {
          handleRoll();
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [currentRound, isBlocked, gameOver, isRolling, rounds, playerDice, handleRoll]);

  const handleReroll = () => {
    if (playerRerolls <= 0 || isRolling || isBlocked || !canReroll(playerDice)) return;
    
    setIsRolling(true);
    const newRolls = [rollDice(), rollDice(), rollDice()];
    const newPts = calculatePoints(newRolls);
    
    setPlayerDice(newRolls);
    setPlayerRerolls(playerRerolls - 1);
    setPlayerPoints(typeof newPts === 'number' ? newPts : 0);
    
    setTimeout(() => {
      setIsRolling(false);
      // Если выпала пара+значение или 3 одинаковых - можно готовиться
      // Иначе можно продолжить переброс если есть попытки
    }, 1000);
  };

  const handlePlayerReady = () => {
    if (isBlocked || playerDice[0] === 0) return;
    setPlayerReady(true);
    checkRoundFinish();
  };

  const checkRoundFinish = () => {
    if (playerReady && opponentReady && !isBlocked) {
      // Оба игрока готовы - завершаем раунд
      const playerPts = calculatePoints(playerDice);
      const opponentPts = calculatePoints(opponentDice);
      
      let roundWinner = null;
      const playerThreeKind = playerPts === 'three-of-a-kind';
      const opponentThreeKind = opponentPts === 'three-of-a-kind';
      
      if (playerThreeKind && !opponentThreeKind) {
        roundWinner = true;
        setPlayerScore(prev => prev + 1);
      } else if (opponentThreeKind && !playerThreeKind) {
        roundWinner = false;
        setOpponentScore(prev => prev + 1);
      } else if (playerThreeKind && opponentThreeKind) {
        const playerSum = playerDice.reduce((a, b) => a + b, 0);
        const opponentSum = opponentDice.reduce((a, b) => a + b, 0);
        if (playerSum > opponentSum) {
          roundWinner = true;
          setPlayerScore(prev => prev + 1);
        } else if (opponentSum > playerSum) {
          roundWinner = false;
          setOpponentScore(prev => prev + 1);
        }
      } else if (typeof playerPts === 'number' && typeof opponentPts === 'number') {
        if (playerPts > opponentPts) {
          roundWinner = true;
          setPlayerScore(prev => prev + 1);
        } else if (opponentPts > playerPts) {
          roundWinner = false;
          setOpponentScore(prev => prev + 1);
        }
      }
      
      // Проверка на автопроигрыш и переход к следующему раунду
      setTimeout(() => {
        setPlayerScore(prevPlayerScore => {
          setOpponentScore(prevOpponentScore => {
            const totalRounds = rounds;
            const halfRounds = Math.ceil(totalRounds / 2);
            
            if (prevPlayerScore > halfRounds) {
              setIsBlocked(true);
              setTimeout(() => {
                if (onGameFinish) onGameFinish(true);
              }, 1000);
              return prevOpponentScore;
            }
            
            if (prevOpponentScore > halfRounds) {
              setIsBlocked(true);
              setTimeout(() => {
                if (onGameFinish) onGameFinish(false);
              }, 1000);
              return prevOpponentScore;
            }
            
            // Переход к следующему раунду только если раунд завершен
            if (roundWinner !== null) {
              const currentRoundValue = currentRound;
              if (currentRoundValue < rounds) {
                setTimeout(() => {
                  setCurrentRound(prev => {
                    const nextRound = prev + 1;
                    if (onRoundFinish) onRoundFinish(prev, roundWinner);
                    return nextRound;
                  });
                }, 1200);
              } else {
                setIsBlocked(true);
                const isWinner = prevPlayerScore > prevOpponentScore;
                setTimeout(() => {
                  if (onGameFinish) onGameFinish(isWinner);
                }, 1000);
              }
            }
            
            return prevOpponentScore;
          });
          return prevPlayerScore;
        });
      }, 100);
    }
  };

  // Симуляция готовности соперника (в реальном multiplayer это будет через сервер)
  useEffect(() => {
    if (playerDice[0] > 0 && opponentDice[0] > 0 && !opponentReady && !isBlocked && !playerReady) {
      // Соперник автоматически готовится после небольшой задержки
      const timer = setTimeout(() => {
        if (!opponentReady && !isBlocked && opponentDice[0] > 0) {
          // Симулируем перебросы соперника, если возможно
          // Переброс продолжается пока не выпадет пара+значение или 3 одинаковых
          let oppDice = [...opponentDice];
          let oppRerolls = opponentRerolls;
          
          while (oppRerolls > 0 && canReroll(oppDice)) {
            const newRolls = [rollDice(), rollDice(), rollDice()];
            const newPts = calculatePoints(newRolls);
            // Если выпала пара+значение или 3 одинаковых - останавливаемся
            if (typeof newPts === 'number' && newPts > 0 || newPts === 'three-of-a-kind') {
              oppDice = newRolls;
              oppRerolls--;
              break;
            }
            oppDice = newRolls;
            oppRerolls--;
          }
          
          setOpponentDice(oppDice);
          setOpponentRerolls(oppRerolls);
          const oppPts = calculatePoints(oppDice);
          setOpponentPoints(typeof oppPts === 'number' ? oppPts : 0);
          setOpponentReady(true);
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [playerDice, opponentDice]);
  
  // Проверяем готовность после обновления
  useEffect(() => {
    if (opponentReady && playerReady && !isBlocked) {
      checkRoundFinish();
    }
  }, [playerReady, opponentReady]);

  return (
    <div className="dice-american-game">
      <div className="game-score">
        <div className="score-item">
          <span>Вы: {playerScore}</span>
        </div>
        <div className="score-item">
          <span>Раунд {Math.min(currentRound, rounds)}/{rounds}</span>
        </div>
        <div className="score-item">
          <span>Соперник: {opponentScore}</span>
        </div>
      </div>
      
      {gameOver && gameResult !== null && (
        <div className={`game-over-message ${gameResult ? 'game-over-message--win' : 'game-over-message--lose'}`}>
          {gameResult ? 'Вы выиграли все раунды!' : 'Вы проиграли все раунды!'}
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
          </div>
        </div>
      </div>
      
      {isRolling && (
        <div className="game-status">
          Бросаем кубики...
        </div>
      )}
      
      <div className="game-actions">
        {playerRerolls > 0 && canReroll(playerDice) && !isBlocked && playerDice[0] > 0 && (
          <button 
            className="reroll-button" 
            onClick={handleReroll}
            disabled={isRolling || isBlocked}
          >
            Перебросить ({playerRerolls})
          </button>
        )}
        
        {!playerReady && !isBlocked && playerDice[0] > 0 && (
          <button 
            className="ready-button" 
            onClick={handlePlayerReady}
            disabled={isRolling || isBlocked}
          >
            Готов
          </button>
        )}
        
        {playerReady && !opponentReady && (
          <div className="game-status">
            Ожидание соперника...
          </div>
        )}
      </div>
    </div>
  );
}

DiceAmericanGame.propTypes = {
  rounds: PropTypes.number.isRequired,
  onRoundFinish: PropTypes.func,
  onGameFinish: PropTypes.func.isRequired
};

export default DiceAmericanGame;

