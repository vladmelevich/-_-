import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { log, logError, logAction, logState, logData, validateAndLog } from '../../utils/devMode.js';

function DiceSumGame({ rounds, onRoundFinish, onGameFinish, isBotGame }) {
  // Валидация пропсов
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
      logAction('roundFinished', { playerWon, playerSum, opponentSum, round: roundNumber });
      
      // Обновляем счет
      if (playerWon) {
        setPlayerScore(prev => prev + 1);
      } else {
        setOpponentScore(prev => prev + 1);
      }
      
      // Проверка на завершение игры и переход к следующему раунду с задержкой
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
            
            // Переход к следующему раунду
            if (roundNumber < rounds) {
              setTimeout(() => {
                if (onRoundFinish) onRoundFinish(roundNumber, playerWon);
                setCurrentRound(roundNumber + 1);
                processingRef.current = false;
              }, 2000);
            } else {
              // Последний раунд завершен
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

  // Сброс кубиков при новом раунде
  useEffect(() => {
    if (currentRound <= rounds && !isBlocked && rounds > 0 && currentRound >= 1) {
      setPlayerDice([0, 0, 0]);
      setOpponentDice([0, 0, 0]);
      setIsRolling(false);
      processingRef.current = false;
    }
  }, [currentRound, rounds, isBlocked]);
  
  // Автоматический запуск раунда
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

  return (
    <div className="dice-sum-game">
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
        <div className="game-status">Бросаем кубики...</div>
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
