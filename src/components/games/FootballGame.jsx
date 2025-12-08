import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { log, logError, logAction, validateAndLog } from '../../utils/devMode.js';

function FootballGame({ rounds, onRoundFinish, onGameFinish, playerRole, isBotGame }) {
  // Валидация пропсов
  useEffect(() => {
    const validation = validateAndLog(
      { rounds, playerRole, isBotGame },
      {
        rounds: { required: true, type: 'number', min: 1 },
        playerRole: { required: true, type: 'string' },
        isBotGame: { required: false, type: 'boolean' }
      },
      'FootballGame props'
    );
    
    if (!validation.valid) {
      logError('validation', 'Неверные пропсы FootballGame', validation.errors);
    } else {
      log('component', 'FootballGame инициализирован', { rounds, playerRole, isBotGame });
    }
  }, []);
  
  const totalRounds = 3;
  const [currentRound, setCurrentRound] = useState(1);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [playerAttack, setPlayerAttack] = useState(null);
  const [opponentDefense, setOpponentDefense] = useState(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isWaiting, setIsWaiting] = useState(false);
  const [roundResult, setRoundResult] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [bothChosen, setBothChosen] = useState(false);
  const processingRef = useRef(false);

  const isTeacher = playerRole === 'teacher';
  const isAttacker = !isTeacher;
  const isDefender = isTeacher;

  const positions = [
    { id: 1, label: 'Левый верхний угол' },
    { id: 2, label: 'Правый верхний угол' },
    { id: 3, label: 'Левый нижний угол' },
    { id: 4, label: 'Правый нижний угол' },
    { id: 5, label: 'Центр сверху' }
  ];

  const handleAttack = (positionId) => {
    if (!isAttacker || !isPlayerTurn || isWaiting || isBlocked || playerAttack !== null || processingRef.current) {
      log('game', 'Попытка атаки заблокирована', { isAttacker, isPlayerTurn, isWaiting, isBlocked, playerAttack });
      return;
    }
    
    if (!positions.find(p => p.id === positionId)) {
      logError('validation', 'Неверная позиция атаки', { positionId });
      return;
    }
    
    logAction('footballAttack', { positionId, currentRound });
    setPlayerAttack(positionId);
    setIsPlayerTurn(false);
    checkRoundResult();
  };

  const handleDefense = (positionId) => {
    if (!isDefender || !isPlayerTurn || isWaiting || isBlocked || opponentDefense !== null || processingRef.current) {
      log('game', 'Попытка защиты заблокирована', { isDefender, isPlayerTurn, isWaiting, isBlocked, opponentDefense });
      return;
    }
    
    if (!positions.find(p => p.id === positionId)) {
      logError('validation', 'Неверная позиция защиты', { positionId });
      return;
    }
    
    logAction('footballDefense', { positionId, currentRound });
    setOpponentDefense(positionId);
    setIsPlayerTurn(false);
    checkRoundResult();
  };

  const checkRoundResult = () => {
    if (playerAttack !== null && opponentDefense !== null && !bothChosen && !isBlocked && !processingRef.current) {
      processingRef.current = true;
      setBothChosen(true);
      setIsWaiting(true);
      
      const roundNumber = currentRound;
      const attackPos = playerAttack;
      const defensePos = opponentDefense;
      
      setTimeout(() => {
        const blocked = attackPos === defensePos;
        
        if (blocked) {
          // Если блок, то защитник (преподаватель) побеждает, атакующий (ученик) проигрывает
          setRoundResult('blocked');
          // Если игрок - атакующий (ученик), он проиграл
          // Если игрок - защитник (преподаватель), он победил
          const playerWon = isDefender; // Защитник побеждает при блоке
          setIsBlocked(true);
          processingRef.current = false;
          setTimeout(() => {
            if (onGameFinish) onGameFinish(playerWon);
          }, 2000);
        } else {
          // Если не заблокирован, то атакующий (ученик) побеждает
          const attackerWon = true;
          setPlayerScore(prev => prev + 1);
          setRoundResult('scored');
          setIsWaiting(false);
          
          setCurrentRound(prevRound => {
            if (prevRound === roundNumber && prevRound < totalRounds) {
              const nextRound = prevRound + 1;
              setTimeout(() => {
                if (onRoundFinish) onRoundFinish(prevRound, attackerWon);
                processingRef.current = false;
              }, 2000);
              return nextRound;
            } else if (prevRound === roundNumber && prevRound >= totalRounds) {
              setIsBlocked(true);
              processingRef.current = false;
              setTimeout(() => {
                setPlayerScore(prevPlayer => {
                  // Если игрок - атакующий (ученик), он побеждает если забил хотя бы один гол
                  // Если игрок - защитник (преподаватель), он проигрывает если соперник забил хотя бы один гол
                  const finalPlayerWon = isAttacker ? prevPlayer > 0 : prevPlayer === 0;
                  if (onGameFinish) onGameFinish(finalPlayerWon);
                  return prevPlayer;
                });
              }, 2000);
              return prevRound;
            }
            processingRef.current = false;
            return prevRound;
          });
        }
      }, 1000);
    }
  };

  useEffect(() => {
    if (playerAttack !== null && opponentDefense !== null && !bothChosen && !isBlocked && !processingRef.current) {
      checkRoundResult();
    }
  }, [playerAttack, opponentDefense, bothChosen, isBlocked]);

  // Сброс состояния при новом раунде
  useEffect(() => {
    if (currentRound <= totalRounds && !isBlocked && totalRounds > 0 && currentRound >= 1) {
      setPlayerAttack(null);
      setOpponentDefense(null);
      setRoundResult(null);
      setBothChosen(false);
      setIsPlayerTurn(true);
      setIsWaiting(false);
      processingRef.current = false;
    }
  }, [currentRound, totalRounds, isBlocked]);
  
  // Логика бота - бот всегда играет за противоположную роль
  // Если игрок - защитник (преподаватель), бот - атакующий (ученик)
  // Если игрок - атакующий (ученик), бот - защитник (преподаватель)
  useEffect(() => {
    if (isBotGame && currentRound <= totalRounds && !isBlocked && !isWaiting && !processingRef.current) {
      // Бот играет за защитника (если игрок - атакующий)
      if (isAttacker && opponentDefense === null) {
        const timer = setTimeout(() => {
          if (!isBlocked && opponentDefense === null && !processingRef.current && currentRound <= totalRounds) {
            const defensePosition = positions[Math.floor(Math.random() * positions.length)].id;
            logAction('botDefense', { position: defensePosition, round: currentRound });
            setOpponentDefense(defensePosition);
            // checkRoundResult будет вызван автоматически через useEffect
          }
        }, 800 + Math.random() * 1200);
        return () => clearTimeout(timer);
      }
      
      // Бот играет за атакующего (если игрок - защитник)
      if (isDefender && playerAttack === null) {
        const timer = setTimeout(() => {
          if (!isBlocked && playerAttack === null && !processingRef.current && currentRound <= totalRounds) {
            const attackPosition = positions[Math.floor(Math.random() * positions.length)].id;
            logAction('botAttack', { position: attackPosition, round: currentRound });
            setPlayerAttack(attackPosition);
            // checkRoundResult будет вызван автоматически через useEffect
          }
        }, 800 + Math.random() * 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [isBotGame, isAttacker, isDefender, currentRound, isBlocked, playerAttack, opponentDefense, isWaiting, bothChosen]);

  return (
    <div className="football-game">
      <div className="game-score">
        <div className="score-item">
          <span>{isAttacker ? 'Вы (Атака)' : 'Вы (Защита)'}: {isAttacker ? playerScore : opponentScore}</span>
        </div>
        <div className="score-item">
          <span>Раунд {Math.min(Math.max(currentRound, 1), totalRounds)}/{totalRounds}</span>
        </div>
        <div className="score-item">
          <span>{isAttacker ? 'Соперник (Защита)' : 'Соперник (Атака)'}: {isAttacker ? opponentScore : playerScore}</span>
        </div>
      </div>
      
      <div className="football-field">
        <div className="football-positions">
          {positions.map((pos) => (
            <button
              key={pos.id}
              className={`football-position ${playerAttack === pos.id && bothChosen ? 'football-position--selected' : ''} ${opponentDefense === pos.id && bothChosen ? 'football-position--defended' : ''}`}
              onClick={() => isAttacker ? handleAttack(pos.id) : handleDefense(pos.id)}
              disabled={!isPlayerTurn || isWaiting || isBlocked || (isAttacker && playerAttack !== null) || (isDefender && opponentDefense !== null)}
            >
              <div className="football-position-label">{pos.label}</div>
              {playerAttack === pos.id && bothChosen && <div className="football-marker">⚽</div>}
              {opponentDefense === pos.id && bothChosen && <div className="football-marker">🛡️</div>}
            </button>
          ))}
        </div>
        
        {roundResult && bothChosen && (
          <div className={`football-result ${roundResult === 'scored' ? 'football-result--scored' : 'football-result--blocked'}`}>
            {roundResult === 'scored' ? '⚽ ГОЛ!' : '🛡️ Заблокировано! Защитник побеждает!'}
          </div>
        )}
      </div>
      
      {isAttacker && isPlayerTurn && !isWaiting && !isBlocked && playerAttack === null && (
        <div className="football-instruction">
          Выберите позицию для атаки (соперник не видит ваш выбор)
        </div>
      )}
      
      {isDefender && isPlayerTurn && !isWaiting && !isBlocked && opponentDefense === null && (
        <div className="football-instruction">
          Выберите позицию для защиты (соперник не видит ваш выбор)
        </div>
      )}
      
      {((isAttacker && playerAttack !== null && !bothChosen) || (isDefender && opponentDefense !== null && !bothChosen)) && (
        <div className="football-instruction">Ожидание выбора соперника...</div>
      )}
    </div>
  );
}

FootballGame.propTypes = {
  rounds: PropTypes.number.isRequired,
  onRoundFinish: PropTypes.func,
  onGameFinish: PropTypes.func.isRequired,
  playerRole: PropTypes.string,
  isBotGame: PropTypes.bool
};

export default FootballGame;
