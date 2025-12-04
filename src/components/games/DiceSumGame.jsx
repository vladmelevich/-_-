import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

function DiceSumGame({ rounds, onRoundFinish, onGameFinish }) {
  const [currentRound, setCurrentRound] = useState(1);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [playerDice, setPlayerDice] = useState([0, 0, 0]);
  const [opponentDice, setOpponentDice] = useState([0, 0, 0]);
  const [isRolling, setIsRolling] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const rollDice = () => {
    return Math.floor(Math.random() * 6) + 1;
  };

  const handleRoll = useCallback(() => {
    if (isRolling || isBlocked) return;
    
    setIsRolling(true);
    
    // Бросаем кубики
    const playerRolls = [rollDice(), rollDice(), rollDice()];
    const opponentRolls = [rollDice(), rollDice(), rollDice()];
    
    setPlayerDice(playerRolls);
    setOpponentDice(opponentRolls);
    
    const playerSum = playerRolls.reduce((a, b) => a + b, 0);
    const opponentSum = opponentRolls.reduce((a, b) => a + b, 0);
    
    setTimeout(() => {
      setIsRolling(false);
      
      // Обновляем счета и проверяем результаты
      const playerWon = playerSum > opponentSum;
      
      setPlayerScore(prevScore => {
        setOpponentScore(prevOpponentScore => {
          const newPlayerScore = playerWon ? prevScore + 1 : prevScore;
          const newOpponentScore = !playerWon ? prevOpponentScore + 1 : prevOpponentScore;
          
          // Проверка на автопроигрыш (> 50% раундов)
          const totalRounds = rounds;
          const halfRounds = Math.ceil(totalRounds / 2);
          
          if (newPlayerScore > halfRounds) {
            setIsBlocked(true);
            setTimeout(() => {
              if (onGameFinish) onGameFinish(true);
            }, 1000);
            return prevOpponentScore;
          }
          
          if (newOpponentScore > halfRounds) {
            setIsBlocked(true);
            setTimeout(() => {
              if (onGameFinish) onGameFinish(false);
            }, 1000);
            return prevOpponentScore;
          }
          
          // Переход к следующему раунду
          setTimeout(() => {
            setCurrentRound(prevRound => {
              if (prevRound < rounds) {
                const nextRound = prevRound + 1;
                if (onRoundFinish) onRoundFinish(prevRound, playerWon);
                return nextRound;
              } else {
                setIsBlocked(true);
                const isWinner = newPlayerScore > newOpponentScore;
                setTimeout(() => {
                  if (onGameFinish) onGameFinish(isWinner);
                }, 1000);
                return prevRound;
              }
            });
          }, 1200);
          
          return newOpponentScore;
        });
        return newPlayerScore;
      });
    }, 800);
  }, [isRolling, isBlocked, rounds, onRoundFinish, onGameFinish]);
  
  // Сброс состояния и автоматический запуск нового раунда
  useEffect(() => {
    if (currentRound <= rounds && !isBlocked && !isRolling && playerDice[0] === 0) {
      // Сбрасываем состояние
      setPlayerDice([0, 0, 0]);
      setOpponentDice([0, 0, 0]);
      setIsRolling(false);
      
      // Автоматически запускаем новый раунд после небольшой задержки
      const timer = setTimeout(() => {
        if (!isBlocked && !isRolling) {
          handleRoll();
        }
      }, 600);
      
      return () => clearTimeout(timer);
    }
  }, [currentRound, isBlocked, isRolling, rounds, handleRoll]);

  return (
    <div className="dice-sum-game">
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
          <div className="dice-sum">
            Сумма: {playerDice.reduce((a, b) => a + b, 0) || '?'}
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
          <div className="dice-sum">
            Сумма: {opponentDice.reduce((a, b) => a + b, 0) || '?'}
          </div>
        </div>
      </div>
      
      {isRolling && (
        <div className="game-status">
          Бросаем кубики...
        </div>
      )}
    </div>
  );
}

DiceSumGame.propTypes = {
  rounds: PropTypes.number.isRequired,
  onRoundFinish: PropTypes.func,
  onGameFinish: PropTypes.func.isRequired
};

export default DiceSumGame;

