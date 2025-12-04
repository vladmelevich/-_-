import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function NvutiGame({ rounds, onRoundFinish, onGameFinish, playerRole }) {
  const [currentRound, setCurrentRound] = useState(1);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [teacherChoice, setTeacherChoice] = useState(null); // 'low' (1-50) or 'high' (51-100)
  const [randomNumber, setRandomNumber] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [roundFinished, setRoundFinished] = useState(false);

  // Определяем, является ли игрок преподавателем
  const isTeacher = playerRole === 'teacher';

  const handleChoice = (choice) => {
    if (isWaiting || teacherChoice !== null || isBlocked) return;
    if (!isTeacher) {
      return;
    }
    
    setTeacherChoice(choice);
    setIsWaiting(true);
    
    // Генерируем случайное число
    setTimeout(() => {
      const number = Math.floor(Math.random() * 100) + 1;
      setRandomNumber(number);
      
      const teacherWon = (choice === 'low' && number <= 50) || (choice === 'high' && number > 50);
      
      setPlayerScore(prevScore => {
        setOpponentScore(prevOpponentScore => {
          let newPlayerScore = prevScore;
          let newOpponentScore = prevOpponentScore;
          
          if (teacherWon) {
            newPlayerScore = prevScore + 1;
          } else {
            newOpponentScore = prevOpponentScore + 1;
          }
          
          setIsWaiting(false);
          setRoundFinished(true);
          
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
          
          // Автоматический переход к следующему раунду
          if (currentRound < rounds) {
            setTimeout(() => {
              setCurrentRound(prev => prev + 1);
              setTeacherChoice(null);
              setRandomNumber(null);
              setRoundFinished(false);
              if (onRoundFinish) onRoundFinish(currentRound, teacherWon);
            }, 1500);
          } else {
            setIsBlocked(true);
            const isWinner = newPlayerScore > newOpponentScore;
            setTimeout(() => {
              if (onGameFinish) onGameFinish(isWinner);
            }, 1000);
          }
          
          return newOpponentScore;
        });
        return newPlayerScore;
      });
    }, 600);
  };

  // Сброс состояния при переходе к новому раунду
  useEffect(() => {
    if (currentRound <= rounds && !isBlocked) {
      setTeacherChoice(null);
      setRandomNumber(null);
      setIsWaiting(false);
      setRoundFinished(false);
    }
  }, [currentRound]);

  return (
    <div className="nvuti-game">
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
      
      <div className="nvuti-container">
        <div className="nvuti-choice-section">
          <h3>{isTeacher ? 'Выберите диапазон (Преподаватель)' : 'Ожидание выбора преподавателя'}</h3>
          {!isTeacher && teacherChoice === null && !isWaiting && !isBlocked && (
            <div className="game-status">
              Ожидание выбора преподавателя...
            </div>
          )}
          {isTeacher && teacherChoice === null && !isWaiting && !isBlocked && (
            <div className="nvuti-choices">
              <button
                className="nvuti-choice"
                onClick={() => handleChoice('low')}
                disabled={isBlocked || isWaiting}
              >
                <div className="nvuti-range">1 - 50</div>
                <div className="nvuti-label">Низкий</div>
              </button>
              <button
                className="nvuti-choice"
                onClick={() => handleChoice('high')}
                disabled={isBlocked || isWaiting}
              >
                <div className="nvuti-range">51 - 100</div>
                <div className="nvuti-label">Высокий</div>
              </button>
            </div>
          )}
          {!isTeacher && teacherChoice === null && !isWaiting && !isBlocked && (
            <div className="nvuti-choices">
              <div className="nvuti-choice nvuti-choice--disabled">
                <div className="nvuti-range">1 - 50</div>
                <div className="nvuti-label">Низкий</div>
              </div>
              <div className="nvuti-choice nvuti-choice--disabled">
                <div className="nvuti-range">51 - 100</div>
                <div className="nvuti-label">Высокий</div>
              </div>
            </div>
          )}
        </div>
        
        {randomNumber !== null && (
          <div className="nvuti-result">
            <div className="nvuti-number-display">
              <div className="nvuti-number-label">Выпало число:</div>
              <div className="nvuti-number">{randomNumber}</div>
              <div className="nvuti-winner">
                {((teacherChoice === 'low' && randomNumber <= 50) || (teacherChoice === 'high' && randomNumber > 50))
                  ? (isTeacher ? 'Вы выиграли раунд!' : 'Преподаватель выиграл раунд!')
                  : (isTeacher ? 'Вы проиграли раунд!' : 'Вы выиграли раунд!')}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

NvutiGame.propTypes = {
  rounds: PropTypes.number.isRequired,
  onRoundFinish: PropTypes.func,
  onGameFinish: PropTypes.func.isRequired,
  playerRole: PropTypes.string
};

export default NvutiGame;

