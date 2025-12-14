import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { log, logError, logAction, validateAndLog } from '../../utils/devMode.js';

function NvutiGame({ rounds, onRoundFinish, onGameFinish, playerRole, isBotGame }) {
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
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayNumber, setDisplayNumber] = useState(null);
  const [finalPlayerWon, setFinalPlayerWon] = useState(null);
  const processingRef = useRef(false);

  const isTeacher = playerRole === 'teacher';

  // Анимация спиннера чисел
  const animateNumber = (finalNumber, callback) => {
    setIsSpinning(true);
    let iterations = 0;
    const maxIterations = 20;
    const interval = setInterval(() => {
      setDisplayNumber(Math.floor(Math.random() * 100) + 1);
      iterations++;
      if (iterations >= maxIterations) {
        clearInterval(interval);
        setDisplayNumber(finalNumber);
        setIsSpinning(false);
        if (callback) callback();
      }
    }, 80);
  };

  const handleChoice = (choice, forceBot = false) => {
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
    
    setTimeout(() => {
      const number = Math.floor(Math.random() * 100) + 1;
      
      animateNumber(number, () => {
        setRandomNumber(number);
        
        const teacherWon = (choice === 'low' && number <= 50) || (choice === 'high' && number > 50);
        
        setIsWaiting(false);
        
        setTimeout(() => {
          if (isBlocked || processingRef.current === false) {
            processingRef.current = false;
            return;
          }
          
          // 65% шанс проиграть, 35% шанс выиграть
          const randomChance = Math.random();
          const shouldWin = randomChance < 0.35;
          const playerWon = shouldWin ? (isTeacher ? teacherWon : !teacherWon) : !(isTeacher ? teacherWon : !teacherWon);
          setFinalPlayerWon(playerWon);
          
          if (playerWon) {
            setPlayerScore(prev => prev + 1);
          } else {
            setOpponentScore(prev => prev + 1);
          }
          
          setTimeout(() => {
            if (isBlocked) {
              processingRef.current = false;
              return;
            }
            
            setPlayerScore(prevPlayer => {
              setOpponentScore(prevOpponent => {
              const halfRounds = Math.ceil(rounds / 2);
              
                if (prevPlayer > halfRounds) {
                setIsBlocked(true);
                processingRef.current = false;
                setTimeout(() => {
                  if (onGameFinish) onGameFinish(true);
                }, 2000);
                  return prevOpponent;
              }
              
                if (prevOpponent > halfRounds) {
                setIsBlocked(true);
                processingRef.current = false;
                setTimeout(() => {
                  if (onGameFinish) onGameFinish(false);
                }, 2000);
                  return prevOpponent;
              }
              
                if (roundNumber < rounds) {
                  setTimeout(() => {
                    if (onRoundFinish) onRoundFinish(roundNumber, playerWon);
                    setTeacherChoice(null);
                    setRandomNumber(null);
                    setDisplayNumber(null);
                    setFinalPlayerWon(null);
                    setCurrentRound(roundNumber + 1);
                    processingRef.current = false;
                  }, 2500);
                } else {
                  setIsBlocked(true);
                  processingRef.current = false;
                  const isWinner = prevPlayer > prevOpponent;
                  setTimeout(() => {
                    if (onGameFinish) onGameFinish(isWinner);
                  }, 2000);
                }
              
                return prevOpponent;
            });
              return prevPlayer;
          });
          }, 500);
        }, 1500);
      });
    }, 800);
  };

  useEffect(() => {
    if (currentRound <= rounds && !isBlocked && rounds > 0 && currentRound >= 1) {
      setTeacherChoice(null);
      setRandomNumber(null);
      setDisplayNumber(null);
      setFinalPlayerWon(null);
      setIsWaiting(false);
      setIsSpinning(false);
      processingRef.current = false;
    }
  }, [currentRound, rounds, isBlocked]);
  
  useEffect(() => {
    if (isBotGame && !isTeacher && currentRound <= rounds && !isBlocked && 
        teacherChoice === null && !isWaiting && !processingRef.current) {
      const timer = setTimeout(() => {
        if (!isBlocked && teacherChoice === null && !isWaiting && !processingRef.current && currentRound <= rounds) {
          const botChoice = Math.random() < 0.5 ? 'low' : 'high';
          logAction('botNvutiChoice', { choice: botChoice, round: currentRound });
          handleChoice(botChoice, true);
        }
      }, 800 + Math.random() * 1200);
      return () => clearTimeout(timer);
    }
  }, [isBotGame, isTeacher, currentRound, isBlocked, teacherChoice, isWaiting]);

  const getResultInfo = () => {
    if (!randomNumber || !teacherChoice || finalPlayerWon === null) return null;
    const teacherWon = (teacherChoice === 'low' && randomNumber <= 50) || (teacherChoice === 'high' && randomNumber > 50);
    // Используем сохранённый результат с учётом вероятности 65/35
    const playerWon = finalPlayerWon;
    return { teacherWon, playerWon };
  };

  const resultInfo = getResultInfo();

  return (
    <div className="nvuti-game-container">
      {/* Декоративный фон */}
      <div className="nvuti-bg-effect"></div>
      
      {/* Счёт игры */}
      <div className="nvuti-scoreboard">
        <div className="nvuti-score-card nvuti-score-card--player">
          <div className="nvuti-score-icon">🎯</div>
          <div className="nvuti-score-data">
            <span className="nvuti-score-label">Вы</span>
            <span className="nvuti-score-value">{playerScore}</span>
          </div>
        </div>
        
        <div className="nvuti-round-indicator">
          <div className="nvuti-round-circle">
            <span className="nvuti-round-num">{Math.min(Math.max(currentRound, 1), rounds)}</span>
            <span className="nvuti-round-sep">/</span>
            <span className="nvuti-round-total">{rounds}</span>
          </div>
          <span className="nvuti-round-text">раунд</span>
        </div>
        
        <div className="nvuti-score-card nvuti-score-card--opponent">
          <div className="nvuti-score-icon">🤖</div>
          <div className="nvuti-score-data">
            <span className="nvuti-score-label">Соперник</span>
            <span className="nvuti-score-value">{opponentScore}</span>
          </div>
        </div>
      </div>
      
      {/* Главная игровая область */}
      <div className="nvuti-game-arena">
        {/* Статус ожидания */}
        {!isTeacher && teacherChoice === null && !isWaiting && !isBlocked && (
          <div className="nvuti-waiting-banner">
            <div className="nvuti-waiting-pulse"></div>
            <span>Ожидание выбора преподавателя...</span>
          </div>
        )}
        
        {/* Выбор диапазона */}
        {teacherChoice === null && !isWaiting && !isBlocked && (
          <div className="nvuti-choice-section">
            <h3 className="nvuti-choice-title">
              {isTeacher ? '🎲 Выберите диапазон чисел' : '⏳ Ожидание выбора...'}
            </h3>
            {isTeacher && (
              <p className="nvuti-hint-text">
                Угадайте, в каком диапазоне выпадет случайное число от 1 до 100
              </p>
            )}
            <div className="nvuti-choice-cards">
              <button
                className={`nvuti-choice-card nvuti-choice-card--low ${!isTeacher ? 'nvuti-choice-card--disabled' : ''}`}
                onClick={() => isTeacher && handleChoice('low')}
                disabled={!isTeacher || isBlocked || isWaiting}
              >
                <div className="nvuti-choice-range-visual">
                  <div className="nvuti-range-bar nvuti-range-bar--low">
                    <div className="nvuti-range-fill"></div>
                  </div>
                </div>
                <div className="nvuti-choice-numbers">
                  <span className="nvuti-choice-from">1</span>
                  <span className="nvuti-choice-separator">—</span>
                  <span className="nvuti-choice-to">50</span>
                </div>
                <span className="nvuti-choice-label">Низкий</span>
                <span className="nvuti-choice-percent">50%</span>
              </button>
              
              <button
                className={`nvuti-choice-card nvuti-choice-card--high ${!isTeacher ? 'nvuti-choice-card--disabled' : ''}`}
                onClick={() => isTeacher && handleChoice('high')}
                disabled={!isTeacher || isBlocked || isWaiting}
              >
                <div className="nvuti-choice-range-visual">
                  <div className="nvuti-range-bar nvuti-range-bar--high">
                    <div className="nvuti-range-fill"></div>
                  </div>
                </div>
                <div className="nvuti-choice-numbers">
                  <span className="nvuti-choice-from">51</span>
                  <span className="nvuti-choice-separator">—</span>
                  <span className="nvuti-choice-to">100</span>
                </div>
                <span className="nvuti-choice-label">Высокий</span>
                <span className="nvuti-choice-percent">50%</span>
              </button>
            </div>
          </div>
        )}
        
        {/* Отображение выбора */}
        {teacherChoice !== null && (
          <div className="nvuti-selection-display">
            <div className="nvuti-selected-badge">
              <span className="nvuti-selected-icon">{teacherChoice === 'low' ? '📉' : '📈'}</span>
              <span className="nvuti-selected-text">
                Преподаватель выбрал: <strong>{teacherChoice === 'low' ? '1-50 (Низкий)' : '51-100 (Высокий)'}</strong>
              </span>
            </div>
          </div>
        )}
        
        {/* Дисплей числа */}
        {(isSpinning || displayNumber !== null) && (
          <div className="nvuti-number-display">
            <div className="nvuti-number-frame">
              <div className="nvuti-number-glow"></div>
              <div className={`nvuti-number-value ${isSpinning ? 'nvuti-number-value--spinning' : ''} ${resultInfo ? (resultInfo.playerWon ? 'nvuti-number-value--win' : 'nvuti-number-value--lose') : ''}`}>
                {displayNumber || '?'}
              </div>
            </div>
            <span className="nvuti-number-label">Выпавшее число</span>
          </div>
        )}
        
        {/* Результат раунда */}
        {randomNumber !== null && !isSpinning && resultInfo && (
          <div className={`nvuti-result-card ${resultInfo.playerWon ? 'nvuti-result-card--win' : 'nvuti-result-card--lose'}`}>
            <span className="nvuti-result-icon">{resultInfo.playerWon ? '🎉' : '😔'}</span>
            <span className="nvuti-result-text">
              {resultInfo.teacherWon 
                ? (isTeacher ? 'Вы выиграли раунд!' : 'Преподаватель выиграл раунд!')
                : (isTeacher ? 'Вы проиграли раунд!' : 'Вы выиграли раунд!')}
            </span>
            <span className="nvuti-result-details">
              Число {randomNumber} {randomNumber <= 50 ? '≤ 50 (Низкий)' : '> 50 (Высокий)'}
            </span>
          </div>
        )}
      </div>
      
      {/* Прогресс-бар */}
      <div className="nvuti-progress-section">
        <div className="nvuti-progress-bar">
          <div 
            className="nvuti-progress-fill nvuti-progress-fill--low"
            style={{ width: '50%' }}
          >
            <span>1-50</span>
          </div>
          <div 
            className="nvuti-progress-fill nvuti-progress-fill--high"
            style={{ width: '50%' }}
          >
            <span>51-100</span>
          </div>
          {randomNumber !== null && (
            <div 
              className="nvuti-progress-marker"
              style={{ left: `${randomNumber}%` }}
            >
              <div className="nvuti-marker-line"></div>
              <div className="nvuti-marker-value">{randomNumber}</div>
            </div>
          )}
        </div>
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
