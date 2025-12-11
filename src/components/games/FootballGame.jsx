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
  const [goalkeeperPosition, setGoalkeeperPosition] = useState(null);
  const [ballPosition, setBallPosition] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const processingRef = useRef(false);

  const isTeacher = playerRole === 'teacher';
  const isAttacker = !isTeacher;
  const isDefender = isTeacher;

  const positions = [
    { id: 1, label: 'Левый верхний', x: 15, y: 10 },
    { id: 2, label: 'Правый верхний', x: 85, y: 10 },
    { id: 3, label: 'Левый нижний', x: 15, y: 90 },
    { id: 4, label: 'Правый нижний', x: 85, y: 90 },
    { id: 5, label: 'Центр', x: 50, y: 50 }
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
      
      // Устанавливаем позиции для анимации
      const attackPosition = positions.find(p => p.id === attackPos);
      const defensePosition = positions.find(p => p.id === defensePos);
      
      setGoalkeeperPosition(defensePosition);
      setBallPosition(attackPosition);
      setShowAnimation(true);
      
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
          }, 3000);
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
                setShowAnimation(false);
                setGoalkeeperPosition(null);
                setBallPosition(null);
              }, 3000);
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
              }, 3000);
              return prevRound;
            }
            processingRef.current = false;
            setShowAnimation(false);
            setGoalkeeperPosition(null);
            setBallPosition(null);
            return prevRound;
          });
        }
      }, 1500);
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
      setGoalkeeperPosition(null);
      setBallPosition(null);
      setShowAnimation(false);
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
        {/* Визуализация ворот */}
        <div className="football-goal-container">
          <div className="football-goal">
            {/* Зоны ворот */}
            {positions.map((pos) => (
              <button
                key={pos.id}
                className={`football-goal-zone ${playerAttack === pos.id && bothChosen ? 'football-goal-zone--attacked' : ''} ${opponentDefense === pos.id && bothChosen ? 'football-goal-zone--defended' : ''}`}
                style={{
                  position: 'absolute',
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: 'translate(-50%, -50%)',
                  width: pos.id === 5 ? '20%' : '15%',
                  height: pos.id === 5 ? '20%' : '15%'
                }}
                onClick={() => isAttacker ? handleAttack(pos.id) : handleDefense(pos.id)}
                disabled={!isPlayerTurn || isWaiting || isBlocked || (isAttacker && playerAttack !== null) || (isDefender && opponentDefense !== null)}
              >
                <span className="football-zone-label">{pos.label}</span>
              </button>
            ))}
            
            {/* Вратарь (показывается только после выбора защиты) */}
            {goalkeeperPosition && showAnimation && (
              <div 
                className="football-goalkeeper-animated"
                style={{
                  left: `${goalkeeperPosition.x}%`,
                  top: `${goalkeeperPosition.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                🧤
              </div>
            )}
            
            {/* Мяч (показывается только после выбора атаки) */}
            {ballPosition && showAnimation && (
              <div 
                className={`football-ball-animated ${roundResult === 'scored' ? 'football-ball-animated--scored' : 'football-ball-animated--blocked'}`}
                style={{
                  left: `${ballPosition.x}%`,
                  top: `${ballPosition.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                ⚽
              </div>
            )}
            
            {/* Сетка ворот */}
            <div className="football-goal-net"></div>
          </div>
        </div>
        
        {/* Результат раунда */}
        {roundResult && bothChosen && (
          <div className={`football-result ${roundResult === 'scored' ? 'football-result--scored' : 'football-result--blocked'}`}>
            {roundResult === 'scored' ? '⚽ ГОЛ!' : '🛡️ Заблокировано! Защитник побеждает!'}
          </div>
        )}
      </div>
      
      {/* Инструкции */}
      {isAttacker && isPlayerTurn && !isWaiting && !isBlocked && playerAttack === null && (
        <div className="football-instruction">
          Выберите зону ворот для атаки (соперник не видит ваш выбор)
        </div>
      )}
      
      {isDefender && isPlayerTurn && !isWaiting && !isBlocked && opponentDefense === null && (
        <div className="football-instruction">
          Выберите зону ворот для защиты (соперник не видит ваш выбор)
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
