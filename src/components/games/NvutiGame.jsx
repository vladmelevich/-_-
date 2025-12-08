import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { log, logError, logAction, validateAndLog } from '../../utils/devMode.js';

function NvutiGame({ rounds, onRoundFinish, onGameFinish, playerRole, isBotGame }) {
  // Валидация пропсов
  useEffect(() => {
    const validation = validateAndLog(
      { rounds, playerRole, isBotGame },
      {
        rounds: { required: true, type: 'number', min: 1 },
        playerRole: { required: true, type: 'string' },
        isBotGame: { required: false, type: 'boolean' }
      },
      'NvutiGame props'
    );
    
    if (!validation.valid) {
      logError('validation', 'Неверные пропсы NvutiGame', validation.errors);
    } else {
      log('component', 'NvutiGame инициализирован', { rounds, playerRole, isBotGame });
    }
  }, []);
  
  const [currentRound, setCurrentRound] = useState(1);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [teacherChoice, setTeacherChoice] = useState(null);
  const [randomNumber, setRandomNumber] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const processingRef = useRef(false);

  const isTeacher = playerRole === 'teacher';

  const handleChoice = (choice, forceBot = false) => {
    // Если это бот, пропускаем проверку isTeacher
    if (isWaiting || teacherChoice !== null || isBlocked || (!isTeacher && !forceBot) || processingRef.current) {
      log('game', 'Попытка выбора заблокирована', { isWaiting, teacherChoice, isBlocked, isTeacher, forceBot });
      return;
    }
    
    if (choice !== 'low' && choice !== 'high') {
      logError('validation', 'Неверный выбор диапазона', { choice });
      return;
    }
    
    processingRef.current = true;
    logAction('nvutiChoice', { choice, playerRole });
    setTeacherChoice(choice);
    setIsWaiting(true);
    
    const roundNumber = currentRound;
    
    // Показываем выбор преподавателя обоим участникам
    setTimeout(() => {
      const number = Math.floor(Math.random() * 100) + 1;
      setRandomNumber(number);
      
      const teacherWon = (choice === 'low' && number <= 50) || (choice === 'high' && number > 50);
      
      setIsWaiting(false);
      
      // Обновляем счет только один раз и проверяем условия завершения игры
      setTimeout(() => {
        setPlayerScore(prevPlayer => {
          setOpponentScore(prevOpponent => {
            // Обновляем счет только если есть победитель
            let newPlayerScore = prevPlayer;
            let newOpponentScore = prevOpponent;
            
            if (teacherWon) {
              // Преподаватель выиграл
              newPlayerScore = prevPlayer + 1;
            } else {
              // Ученик выиграл
              newOpponentScore = prevOpponent + 1;
            }
            
            const halfRounds = Math.ceil(rounds / 2);
            
            if (newPlayerScore > halfRounds) {
              setIsBlocked(true);
              processingRef.current = false;
              setTimeout(() => {
                if (onGameFinish) onGameFinish(true);
              }, 2000);
              return newOpponentScore;
            }
            
            if (newOpponentScore > halfRounds) {
              setIsBlocked(true);
              processingRef.current = false;
              setTimeout(() => {
                if (onGameFinish) onGameFinish(false);
              }, 2000);
              return newOpponentScore;
            }
            
            setCurrentRound(prevRound => {
              if (prevRound === roundNumber && prevRound < rounds) {
                const nextRound = prevRound + 1;
                setTimeout(() => {
                  if (onRoundFinish) onRoundFinish(prevRound, teacherWon);
                  setTeacherChoice(null);
                  setRandomNumber(null);
                  processingRef.current = false;
                }, 2500);
                return nextRound;
              } else if (prevRound === roundNumber && prevRound >= rounds) {
                setIsBlocked(true);
                processingRef.current = false;
                const isWinner = newPlayerScore > newOpponentScore;
                setTimeout(() => {
                  if (onGameFinish) onGameFinish(isWinner);
                }, 2000);
                return prevRound;
              }
              processingRef.current = false;
              return prevRound;
            });
            
            return newOpponentScore;
          });
          return newPlayerScore;
        });
      }, 1500);
    }, 1200);
  };

  useEffect(() => {
    if (currentRound <= rounds && !isBlocked && rounds > 0 && currentRound >= 1) {
      setTeacherChoice(null);
      setRandomNumber(null);
      setIsWaiting(false);
      processingRef.current = false;
    }
  }, [currentRound, rounds, isBlocked]);
  
  // Логика бота - бот всегда играет за противоположную роль
  // Если игрок - ученик, бот играет за преподавателя (делает выбор)
  // Если игрок - преподаватель, бот не нужен (только преподаватель делает выбор)
  useEffect(() => {
    // Бот играет за преподавателя только если игрок - ученик
    if (isBotGame && !isTeacher && currentRound <= rounds && !isBlocked && 
        teacherChoice === null && !isWaiting && !processingRef.current) {
      const timer = setTimeout(() => {
        if (!isBlocked && teacherChoice === null && !isWaiting && !processingRef.current && currentRound <= rounds) {
          const botChoice = Math.random() < 0.5 ? 'low' : 'high';
          logAction('botNvutiChoice', { choice: botChoice, round: currentRound });
          handleChoice(botChoice, true); // forceBot = true для бота
        }
      }, 800 + Math.random() * 1200);
      return () => clearTimeout(timer);
    }
  }, [isBotGame, isTeacher, currentRound, isBlocked, teacherChoice, isWaiting]);

  return (
    <div className="nvuti-game">
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
      
      <div className="nvuti-container">
        <div className="nvuti-choice-section">
          <h3>{isTeacher ? 'Выберите диапазон (Преподаватель)' : 'Ожидание выбора преподавателя'}</h3>
          {!isTeacher && teacherChoice === null && !isWaiting && !isBlocked && (
            <div className="game-status">Ожидание выбора преподавателя...</div>
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
        
        {teacherChoice !== null && (
          <div className="nvuti-choice-display">
            <div className="nvuti-choice-info">
              Преподаватель выбрал: <strong>{teacherChoice === 'low' ? 'Низкий (1-50)' : 'Высокий (51-100)'}</strong>
            </div>
          </div>
        )}
        
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
  playerRole: PropTypes.string,
  isBotGame: PropTypes.bool
};

export default NvutiGame;
