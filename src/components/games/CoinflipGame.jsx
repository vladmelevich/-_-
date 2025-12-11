import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { log, logError, logAction, validateAndLog } from '../../utils/devMode.js';

function CoinflipGame({ rounds, onRoundFinish, onGameFinish, playerRole, isBotGame }) {
  // Валидация пропсов
  useEffect(() => {
    const validation = validateAndLog(
      { rounds, playerRole, isBotGame },
      {
        rounds: { required: true, type: 'number', min: 1 },
        playerRole: { required: true, type: 'string' },
        isBotGame: { required: false, type: 'boolean' }
      },
      'CoinflipGame props'
    );
    
    if (!validation.valid) {
      logError('validation', 'Неверные пропсы CoinflipGame', validation.errors);
    } else {
      log('component', 'CoinflipGame инициализирован', { rounds, playerRole, isBotGame });
    }
  }, []);
  
  const [currentRound, setCurrentRound] = useState(1);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [teacherChoice, setTeacherChoice] = useState(null);
  const [coinResult, setCoinResult] = useState(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [flipCount, setFlipCount] = useState(0);
  const processingRef = useRef(false);

  const isTeacher = playerRole === 'teacher';

  const handleChoice = (choice, forceBot = false) => {
    if (isFlipping || teacherChoice !== null || isBlocked || (!isTeacher && !forceBot) || processingRef.current) {
      log('game', 'Попытка выбора заблокирована', { isFlipping, teacherChoice, isBlocked, isTeacher, forceBot });
      return;
    }
    
    if (choice !== 'heads' && choice !== 'tails') {
      logError('validation', 'Неверный выбор монетки', { choice });
      return;
    }
    
    processingRef.current = true;
    logAction('coinChoice', { choice, playerRole });
    setTeacherChoice(choice);
    setIsFlipping(true);
    setFlipCount(prev => prev + 1);
    
    const roundNumber = currentRound;
    
    setTimeout(() => {
      if (isBlocked) {
        processingRef.current = false;
        return;
      }
      
      const result = Math.random() < 0.5 ? 'heads' : 'tails';
      setCoinResult(result);
      
      const teacherWon = choice === result;
      
      setIsFlipping(false);
      
      if (isTeacher && teacherWon) {
        setPlayerScore(prev => prev + 1);
      } else if (!isTeacher && !teacherWon) {
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
                if (onRoundFinish) onRoundFinish(roundNumber, teacherWon);
                setTeacherChoice(null);
                setCoinResult(null);
                setCurrentRound(roundNumber + 1);
                processingRef.current = false;
              }, 2000);
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
      }, 1500);
    }, 2000);
  };

  useEffect(() => {
    if (currentRound <= rounds && !isBlocked && rounds > 0 && currentRound >= 1) {
      setTeacherChoice(null);
      setCoinResult(null);
      setIsFlipping(false);
      processingRef.current = false;
    }
  }, [currentRound, rounds, isBlocked]);
  
  useEffect(() => {
    if (isBotGame && !isTeacher && currentRound <= rounds && !isBlocked && 
        teacherChoice === null && !isFlipping && !processingRef.current) {
      const timer = setTimeout(() => {
        if (!isBlocked && teacherChoice === null && !isFlipping && !processingRef.current && currentRound <= rounds) {
          const botChoice = Math.random() < 0.5 ? 'heads' : 'tails';
          logAction('botCoinChoice', { choice: botChoice, round: currentRound });
          handleChoice(botChoice, true);
        }
      }, 800 + Math.random() * 1200);
      return () => clearTimeout(timer);
    }
  }, [isBotGame, isTeacher, currentRound, isBlocked, teacherChoice, isFlipping]);

  return (
    <div className="coinflip-game-container">
      {/* Декоративный фон */}
      <div className="coinflip-bg-pattern"></div>
      
      {/* Счёт */}
      <div className="coinflip-scoreboard">
        <div className="coinflip-score-card coinflip-score-card--player">
          <div className="coinflip-score-icon">👤</div>
          <div className="coinflip-score-info">
            <span className="coinflip-score-label">Вы</span>
            <span className="coinflip-score-value">{playerScore}</span>
          </div>
        </div>
        <div className="coinflip-score-card coinflip-score-card--round">
          <div className="coinflip-round-badge">
            <span className="coinflip-round-current">{Math.min(Math.max(currentRound, 1), rounds)}</span>
            <span className="coinflip-round-divider">/</span>
            <span className="coinflip-round-total">{rounds}</span>
          </div>
          <span className="coinflip-round-label">раунд</span>
        </div>
        <div className="coinflip-score-card coinflip-score-card--opponent">
          <div className="coinflip-score-icon">🤖</div>
          <div className="coinflip-score-info">
            <span className="coinflip-score-label">Соперник</span>
            <span className="coinflip-score-value">{opponentScore}</span>
          </div>
        </div>
      </div>
      
      {/* Основная область игры */}
      <div className="coinflip-arena">
        {/* Статус ожидания */}
        {!isTeacher && teacherChoice === null && !isFlipping && !isBlocked && (
          <div className="coinflip-waiting-state">
            <div className="coinflip-waiting-pulse"></div>
            <span>Ожидание выбора преподавателя...</span>
          </div>
        )}
        
        {/* Выбор стороны */}
        {teacherChoice === null && !isFlipping && !isBlocked && (
          <div className="coinflip-choice-section">
            <h3 className="coinflip-choice-title">
              {isTeacher ? '🎯 Выберите сторону монеты' : '⏳ Ожидание выбора...'}
            </h3>
            <div className="coinflip-choices-grid">
              <button
                className={`coinflip-choice-btn coinflip-choice-btn--heads ${!isTeacher ? 'coinflip-choice-btn--disabled' : ''}`}
                onClick={() => isTeacher && handleChoice('heads')}
                disabled={!isTeacher || isFlipping || teacherChoice !== null || isBlocked}
              >
                <div className="coinflip-choice-coin coinflip-choice-coin--heads">
                  <span className="coinflip-choice-symbol">🦅</span>
                </div>
                <span className="coinflip-choice-label">Орёл</span>
              </button>
              <button
                className={`coinflip-choice-btn coinflip-choice-btn--tails ${!isTeacher ? 'coinflip-choice-btn--disabled' : ''}`}
                onClick={() => isTeacher && handleChoice('tails')}
                disabled={!isTeacher || isFlipping || teacherChoice !== null || isBlocked}
              >
                <div className="coinflip-choice-coin coinflip-choice-coin--tails">
                  <span className="coinflip-choice-symbol">👑</span>
                </div>
                <span className="coinflip-choice-label">Решка</span>
              </button>
            </div>
          </div>
        )}
        
        {/* 3D Монета */}
        {(isFlipping || coinResult) && (
          <div className="coinflip-result-section">
            <div className={`coinflip-3d-coin ${isFlipping ? 'coinflip-3d-coin--spinning' : ''} ${coinResult ? `coinflip-3d-coin--${coinResult}` : ''}`}>
              <div className="coinflip-3d-coin-inner">
                <div className="coinflip-3d-coin-face coinflip-3d-coin-face--heads">
                  <div className="coinflip-coin-design">
                    <span className="coinflip-coin-icon">🦅</span>
                    <span className="coinflip-coin-text">ОРЁЛ</span>
                  </div>
                </div>
                <div className="coinflip-3d-coin-face coinflip-3d-coin-face--tails">
                  <div className="coinflip-coin-design">
                    <span className="coinflip-coin-icon">👑</span>
                    <span className="coinflip-coin-text">РЕШКА</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Результат */}
            {coinResult && !isFlipping && (
              <div className="coinflip-result-info">
                <div className="coinflip-result-text">
                  Выпало: <strong>{coinResult === 'heads' ? 'Орёл' : 'Решка'}</strong>
                </div>
                {teacherChoice && (
                  <div className="coinflip-teacher-choice">
                    Преподаватель выбрал: <strong>{teacherChoice === 'heads' ? 'Орёл' : 'Решка'}</strong>
                  </div>
                )}
                <div className={`coinflip-round-result ${teacherChoice === coinResult ? (isTeacher ? 'coinflip-round-result--win' : 'coinflip-round-result--lose') : (isTeacher ? 'coinflip-round-result--lose' : 'coinflip-round-result--win')}`}>
                  {teacherChoice === coinResult 
                    ? (isTeacher ? '🎉 Вы выиграли раунд!' : '😔 Преподаватель выиграл раунд!')
                    : (isTeacher ? '😔 Вы проиграли раунд!' : '🎉 Вы выиграли раунд!')}
                </div>
              </div>
            )}
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
  playerRole: PropTypes.string,
  isBotGame: PropTypes.bool
};

export default CoinflipGame;
