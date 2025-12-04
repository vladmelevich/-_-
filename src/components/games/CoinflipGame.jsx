import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function CoinflipGame({ rounds, onRoundFinish, onGameFinish, playerRole }) {
  const [currentRound, setCurrentRound] = useState(1);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [teacherChoice, setTeacherChoice] = useState(null); // 'heads' or 'tails'
  const [coinResult, setCoinResult] = useState(null); // 'heads' or 'tails'
  const [isFlipping, setIsFlipping] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  // Преподаватель всегда выбирает
  const isTeacher = playerRole === 'teacher';

  const handleChoice = (choice) => {
    if (isFlipping || teacherChoice !== null || isBlocked) return;
    if (!isTeacher) {
      alert('Только преподаватель может выбирать сторону монетки!');
      return;
    }
    
    setTeacherChoice(choice);
    setIsFlipping(true);
    
    // Генерируем результат монетки
    setTimeout(() => {
      const result = Math.random() < 0.5 ? 'heads' : 'tails';
      setCoinResult(result);
      
      const teacherWon = choice === result;
      
      setPlayerScore(prevScore => {
        setOpponentScore(prevOpponentScore => {
          const newPlayerScore = teacherWon ? prevScore + 1 : prevScore;
          const newOpponentScore = !teacherWon ? prevOpponentScore + 1 : prevOpponentScore;
          
          setIsFlipping(false);
          
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
          
          if (currentRound < rounds) {
            setTimeout(() => {
              setCurrentRound(prev => prev + 1);
              setTeacherChoice(null);
              setCoinResult(null);
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
    }, 800);
  };

  // Сброс состояния при переходе к новому раунду
  useEffect(() => {
    if (currentRound <= rounds) {
      setTeacherChoice(null);
      setCoinResult(null);
      setIsFlipping(false);
    }
  }, [currentRound]);


  return (
    <div className="coinflip-game">
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
      
      <div className="coinflip-container">
        {!isTeacher && teacherChoice === null && !isFlipping && !isBlocked && (
          <div className="game-status">
            Ожидание выбора преподавателя...
          </div>
        )}
        {isTeacher && teacherChoice === null && !isFlipping && !isBlocked && (
          <div className="game-status">
            Выберите сторону монетки (Преподаватель)
          </div>
        )}
        
        <div className="coinflip-choices">
          {isTeacher ? (
            <>
              <button
                className={`coinflip-choice ${teacherChoice === 'heads' ? 'coinflip-choice--selected' : ''}`}
                onClick={() => handleChoice('heads')}
                disabled={isFlipping || teacherChoice !== null || isBlocked}
              >
                <div className="coinflip-icon">🪙</div>
                <div className="coinflip-label">Орел</div>
              </button>
              <button
                className={`coinflip-choice ${teacherChoice === 'tails' ? 'coinflip-choice--selected' : ''}`}
                onClick={() => handleChoice('tails')}
                disabled={isFlipping || teacherChoice !== null || isBlocked}
              >
                <div className="coinflip-icon">🪙</div>
                <div className="coinflip-label">Решка</div>
              </button>
            </>
          ) : (
            <>
              <div className="coinflip-choice coinflip-choice--disabled">
                <div className="coinflip-icon">🪙</div>
                <div className="coinflip-label">Орел</div>
              </div>
              <div className="coinflip-choice coinflip-choice--disabled">
                <div className="coinflip-icon">🪙</div>
                <div className="coinflip-label">Решка</div>
              </div>
            </>
          )}
        </div>
        
        {coinResult && (
          <div className="coinflip-result">
            <div className={`coinflip-coin ${isFlipping ? 'coinflip-coin--flipping' : ''} ${coinResult === 'heads' ? 'coinflip-coin--heads' : 'coinflip-coin--tails'}`}>
              <div className="coinflip-coin-face">
                {coinResult === 'heads' ? '🦅' : '💰'}
              </div>
            </div>
            <div className="coinflip-result-text">
              {coinResult === 'heads' ? 'Орел' : 'Решка'}
            </div>
            <div className={`coinflip-winner ${teacherChoice === coinResult ? 'coinflip-winner--win' : 'coinflip-winner--lose'}`}>
              {teacherChoice === coinResult 
                ? (isTeacher ? 'Вы выиграли раунд!' : 'Преподаватель выиграл раунд!')
                : (isTeacher ? 'Вы проиграли раунд!' : 'Вы выиграли раунд!')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

CoinflipGame.propTypes = {
  rounds: PropTypes.number.isRequired,
  onRoundFinish: PropTypes.func,
  onGameFinish: PropTypes.func.isRequired,
  playerRole: PropTypes.string
};

export default CoinflipGame;

