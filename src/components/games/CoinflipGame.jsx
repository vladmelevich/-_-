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
  const processingRef = useRef(false);

  const isTeacher = playerRole === 'teacher';

  const handleChoice = (choice, forceBot = false) => {
    // Если это бот, пропускаем проверку isTeacher
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
      
      // Обновляем счет только один раз
      // Если игрок - преподаватель и выиграл, или игрок - ученик и проиграл (преподаватель выиграл)
      if (isTeacher && teacherWon) {
        // Преподаватель выиграл
        setPlayerScore(prev => prev + 1);
      } else if (!isTeacher && !teacherWon) {
        // Ученик выиграл (преподаватель проиграл)
        setPlayerScore(prev => prev + 1);
      } else {
        // Преподаватель выиграл (когда игрок - ученик) или ученик выиграл (когда игрок - преподаватель)
        setOpponentScore(prev => prev + 1);
      }
      
      // Проверяем условия завершения игры и переход к следующему раунду с задержкой
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
            
            // Переход к следующему раунду
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
    }, 1000);
  };

  useEffect(() => {
    if (currentRound <= rounds && !isBlocked && rounds > 0 && currentRound >= 1) {
      setTeacherChoice(null);
      setCoinResult(null);
      setIsFlipping(false);
      processingRef.current = false;
    }
  }, [currentRound, rounds, isBlocked]);
  
  // Логика бота - бот всегда играет за противоположную роль
  // Если игрок - ученик, бот играет за преподавателя (делает выбор)
  // Если игрок - преподаватель, бот не нужен (только преподаватель делает выбор)
  useEffect(() => {
    // Бот играет за преподавателя только если игрок - ученик
    if (isBotGame && !isTeacher && currentRound <= rounds && !isBlocked && 
        teacherChoice === null && !isFlipping && !processingRef.current) {
      const timer = setTimeout(() => {
        if (!isBlocked && teacherChoice === null && !isFlipping && !processingRef.current && currentRound <= rounds) {
          const botChoice = Math.random() < 0.5 ? 'heads' : 'tails';
          logAction('botCoinChoice', { choice: botChoice, round: currentRound });
          handleChoice(botChoice, true); // forceBot = true для бота
        }
      }, 800 + Math.random() * 1200);
      return () => clearTimeout(timer);
    }
  }, [isBotGame, isTeacher, currentRound, isBlocked, teacherChoice, isFlipping]);

  return (
    <div className="coinflip-game">
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
      
      <div className="coinflip-container">
        {!isTeacher && teacherChoice === null && !isFlipping && !isBlocked && (
          <div className="game-status">Ожидание выбора преподавателя...</div>
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
            {teacherChoice && (
              <div className="coinflip-choice-display">
                Преподаватель выбрал: {teacherChoice === 'heads' ? 'Орел' : 'Решка'}
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
