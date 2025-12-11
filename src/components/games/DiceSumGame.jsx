import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { log, logError, logAction, logData, validateAndLog } from '../../utils/devMode.js';

// Компонент красивого кубика с точками
const BeautifulDice = ({ value, isRolling, delay = 0, highlight }) => {
  const dots = {
    1: [[50, 50]],
    2: [[30, 30], [70, 70]],
    3: [[30, 30], [50, 50], [70, 70]],
    4: [[30, 30], [70, 30], [30, 70], [70, 70]],
    5: [[30, 30], [70, 30], [50, 50], [30, 70], [70, 70]],
    6: [[30, 30], [70, 30], [30, 50], [70, 50], [30, 70], [70, 70]]
  };
  
  const currentDots = value && typeof value === 'number' ? dots[value] || [] : [];
  
  return (
    <div 
      className={`dice-sum-cube ${isRolling ? 'dice-sum-cube--rolling' : ''} ${highlight ? 'dice-sum-cube--highlight' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="dice-sum-cube-face">
        {value === 0 ? (
          <span className="dice-sum-cube-placeholder">?</span>
        ) : (
          <>
            {currentDots.map((dot, i) => (
              <div 
                key={i} 
                className="dice-sum-cube-dot"
                style={{ 
                  left: `${dot[0]}%`, 
                  top: `${dot[1]}%`,
                  animationDelay: `${i * 50}ms`
                }}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

function DiceSumGame({ rounds, onRoundFinish, onGameFinish, isBotGame }) {
  useEffect(() => {
    const validation = validateAndLog(
      { rounds, isBotGame },
      {
        rounds: { required: true, type: 'number', min: 1 },
        isBotGame: { required: false, type: 'boolean' }
      },
      'DiceSumGame props'
    );
    
    if (!validation.valid) {
      logError('validation', 'Неверные пропсы DiceSumGame', validation.errors);
    } else {
      log('component', 'DiceSumGame инициализирован', { rounds, isBotGame });
    }
  }, []);
  
  const [currentRound, setCurrentRound] = useState(1);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [playerDice, setPlayerDice] = useState([0, 0, 0]);
  const [opponentDice, setOpponentDice] = useState([0, 0, 0]);
  const [isRolling, setIsRolling] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [lastWinner, setLastWinner] = useState(null);
  const processingRef = useRef(false);

  const rollDice = () => Math.floor(Math.random() * 6) + 1;

  const startRound = () => {
    if (isBlocked || isRolling || processingRef.current || currentRound > rounds) {
      log('game', 'Попытка начать раунд заблокирована', { isBlocked, isRolling, currentRound, rounds });
      return;
    }
    
    processingRef.current = true;
    logAction('roundStart', { currentRound, rounds });
    setIsRolling(true);
    setLastWinner(null);
    
    const roundNumber = currentRound;
    const playerRolls = [rollDice(), rollDice(), rollDice()];
    const opponentRolls = [rollDice(), rollDice(), rollDice()];
    
    logData('diceRolled', { playerRolls, opponentRolls, currentRound: roundNumber });
    
    setPlayerDice(playerRolls);
    setOpponentDice(opponentRolls);
    
    setTimeout(() => {
      setIsRolling(false);
      
      const playerSum = playerRolls.reduce((a, b) => a + b, 0);
      const opponentSum = opponentRolls.reduce((a, b) => a + b, 0);
      
      logData('roundResult', { playerSum, opponentSum, currentRound: roundNumber });
      
      const playerWon = playerSum > opponentSum;
      setLastWinner(playerWon ? 'player' : 'opponent');
      logAction('roundFinished', { playerWon, playerSum, opponentSum, round: roundNumber });
      
      if (playerWon) {
        setPlayerScore(prev => prev + 1);
      } else {
        setOpponentScore(prev => prev + 1);
      }
      
      setTimeout(() => {
        setPlayerScore(prevPlayer => {
          setOpponentScore(prevOpponent => {
            const halfRounds = Math.ceil(rounds / 2);
            
            if (prevPlayer > halfRounds) {
              logAction('gameWon', { reason: 'playerScore > halfRounds', playerScore: prevPlayer, halfRounds });
              setIsBlocked(true);
              processingRef.current = false;
              setTimeout(() => {
                if (onGameFinish) onGameFinish(true);
              }, 2000);
              return prevOpponent;
            }
            
            if (prevOpponent > halfRounds) {
              logAction('gameLost', { reason: 'opponentScore > halfRounds', opponentScore: prevOpponent, halfRounds });
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
    }, 1500);
  };

  useEffect(() => {
    if (currentRound <= rounds && !isBlocked && rounds > 0 && currentRound >= 1) {
      setPlayerDice([0, 0, 0]);
      setOpponentDice([0, 0, 0]);
      setIsRolling(false);
      setLastWinner(null);
      processingRef.current = false;
    }
  }, [currentRound, rounds, isBlocked]);
  
  useEffect(() => {
    if (currentRound <= rounds && !isBlocked && playerDice[0] === 0 && rounds > 0 && !isRolling && !processingRef.current && currentRound >= 1) {
      const timer = setTimeout(() => {
        if (!isBlocked && playerDice[0] === 0 && !isRolling && !processingRef.current && currentRound <= rounds && currentRound >= 1) {
          startRound();
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentRound, rounds, isBlocked, playerDice, isRolling]);

  const playerSum = playerDice.reduce((a, b) => a + b, 0);
  const opponentSum = opponentDice.reduce((a, b) => a + b, 0);

  return (
    <div className="dice-sum-game">
      {/* Градиентный фон */}
      <div className="dice-sum-bg"></div>
      
      {/* Панель счёта */}
      <div className="dice-sum-scoreboard">
        <div className={`dice-sum-score-card ${lastWinner === 'player' ? 'dice-sum-score-card--winner' : ''}`}>
          <div className="dice-sum-score-avatar">👤</div>
          <div className="dice-sum-score-details">
            <span className="dice-sum-score-name">Вы</span>
            <span className="dice-sum-score-points">{playerScore}</span>
          </div>
        </div>
        
        <div className="dice-sum-round-indicator">
          <div className="dice-sum-round-circle">
            <span className="dice-sum-round-number">{Math.min(Math.max(currentRound, 1), rounds)}</span>
            <span className="dice-sum-round-total">/{rounds}</span>
          </div>
          <span className="dice-sum-round-text">раунд</span>
        </div>
        
        <div className={`dice-sum-score-card ${lastWinner === 'opponent' ? 'dice-sum-score-card--winner' : ''}`}>
          <div className="dice-sum-score-avatar">🤖</div>
          <div className="dice-sum-score-details">
            <span className="dice-sum-score-name">Соперник</span>
            <span className="dice-sum-score-points">{opponentScore}</span>
          </div>
        </div>
      </div>
      
      {/* Игровое поле */}
      <div className="dice-sum-arena">
        {/* Блок игрока */}
        <div className={`dice-sum-player-block ${lastWinner === 'player' ? 'dice-sum-player-block--winner' : ''}`}>
          <div className="dice-sum-player-title">
            <span className="dice-sum-player-icon">🎲</span>
            <span>Ваши кубики</span>
          </div>
          <div className="dice-sum-dice-container">
            {playerDice.map((dice, i) => (
              <BeautifulDice 
                key={i} 
                value={dice} 
                isRolling={isRolling} 
                delay={i * 100}
                highlight={lastWinner === 'player'}
              />
            ))}
          </div>
          <div className={`dice-sum-total ${lastWinner === 'player' ? 'dice-sum-total--winner' : ''}`}>
            <span className="dice-sum-total-label">Сумма:</span>
            <span className="dice-sum-total-value">
              {playerSum > 0 ? playerSum : '?'}
            </span>
          </div>
        </div>
        
        {/* Центральная секция VS */}
        <div className="dice-sum-versus">
          <div className={`dice-sum-versus-badge ${isRolling ? 'dice-sum-versus-badge--rolling' : ''}`}>
            {isRolling ? '🎲' : 'VS'}
          </div>
          {lastWinner && !isRolling && (
            <div className={`dice-sum-result-badge ${lastWinner === 'player' ? 'dice-sum-result-badge--win' : 'dice-sum-result-badge--lose'}`}>
              {lastWinner === 'player' ? '🎉 Победа!' : '😔 Поражение'}
            </div>
          )}
        </div>
        
        {/* Блок соперника */}
        <div className={`dice-sum-player-block ${lastWinner === 'opponent' ? 'dice-sum-player-block--winner' : ''}`}>
          <div className="dice-sum-player-title">
            <span className="dice-sum-player-icon">🤖</span>
            <span>Кубики соперника</span>
          </div>
          <div className="dice-sum-dice-container">
            {opponentDice.map((dice, i) => (
              <BeautifulDice 
                key={i} 
                value={dice} 
                isRolling={isRolling} 
                delay={i * 100 + 150}
                highlight={lastWinner === 'opponent'}
              />
            ))}
          </div>
          <div className={`dice-sum-total ${lastWinner === 'opponent' ? 'dice-sum-total--winner' : ''}`}>
            <span className="dice-sum-total-label">Сумма:</span>
            <span className="dice-sum-total-value">
              {opponentSum > 0 ? opponentSum : '?'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Статус */}
      {isRolling && (
        <div className="dice-sum-status">
          <div className="dice-sum-status-spinner"></div>
          <span>Бросаем кубики...</span>
        </div>
      )}
    </div>
  );
}

DiceSumGame.propTypes = {
  rounds: PropTypes.number.isRequired,
  onRoundFinish: PropTypes.func,
  onGameFinish: PropTypes.func.isRequired,
  isBotGame: PropTypes.bool
};

export default DiceSumGame;
