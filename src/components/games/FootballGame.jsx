import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { log, logError, logAction, validateAndLog } from '../../utils/devMode.js';

function FootballGame({ rounds, onRoundFinish, onGameFinish, playerRole, isBotGame }) {
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
  const [hoveredZone, setHoveredZone] = useState(null);
  const processingRef = useRef(false);

  const isTeacher = playerRole === 'teacher';
  const isAttacker = !isTeacher;
  const isDefender = isTeacher;

  const positions = [
    { id: 1, label: 'Верхний левый', shortLabel: '↖', x: 18, y: 22, emoji: '⬅️' },
    { id: 2, label: 'Верхний правый', shortLabel: '↗', x: 82, y: 22, emoji: '➡️' },
    { id: 3, label: 'Нижний левый', shortLabel: '↙', x: 18, y: 78, emoji: '⬅️' },
    { id: 4, label: 'Нижний правый', shortLabel: '↘', x: 82, y: 78, emoji: '➡️' },
    { id: 5, label: 'Центр', shortLabel: '●', x: 50, y: 50, emoji: '🎯' }
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
      
      const attackPosition = positions.find(p => p.id === attackPos);
      const defensePosition = positions.find(p => p.id === defensePos);
      
      setGoalkeeperPosition(defensePosition);
      setBallPosition(attackPosition);
      setShowAnimation(true);
      
      setTimeout(() => {
        const blocked = attackPos === defensePos;
        
        if (blocked) {
          setRoundResult('blocked');
          // 65% шанс проиграть, 35% шанс выиграть
          const randomChance = Math.random();
          const shouldWin = randomChance < 0.35;
          const playerWon = shouldWin ? isDefender : !isDefender;
          setIsBlocked(true);
          processingRef.current = false;
          setTimeout(() => {
            if (onGameFinish) onGameFinish(playerWon);
          }, 3000);
        } else {
          // 65% шанс проиграть, 35% шанс выиграть
          const randomChance = Math.random();
          const attackerWon = randomChance < 0.35;
          if (attackerWon) {
            setPlayerScore(prev => prev + 1);
          } else {
            setOpponentScore(prev => prev + 1);
          }
          setRoundResult(attackerWon ? 'scored' : 'blocked');
          setIsWaiting(false);
          
          setCurrentRound(prevRound => {
            if (prevRound === roundNumber && prevRound < totalRounds) {
              const nextRound = prevRound + 1;
              setTimeout(() => {
                if (onRoundFinish) onRoundFinish(prevRound, attackerWon && isAttacker);
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
  
  useEffect(() => {
    if (isBotGame && currentRound <= totalRounds && !isBlocked && !isWaiting && !processingRef.current) {
      if (isAttacker && opponentDefense === null) {
        const timer = setTimeout(() => {
          if (!isBlocked && opponentDefense === null && !processingRef.current && currentRound <= totalRounds) {
            const defensePosition = positions[Math.floor(Math.random() * positions.length)].id;
            logAction('botDefense', { position: defensePosition, round: currentRound });
            setOpponentDefense(defensePosition);
          }
        }, 800 + Math.random() * 1200);
        return () => clearTimeout(timer);
      }
      
      if (isDefender && playerAttack === null) {
        const timer = setTimeout(() => {
          if (!isBlocked && playerAttack === null && !processingRef.current && currentRound <= totalRounds) {
            const attackPosition = positions[Math.floor(Math.random() * positions.length)].id;
            logAction('botAttack', { position: attackPosition, round: currentRound });
            setPlayerAttack(attackPosition);
          }
        }, 800 + Math.random() * 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [isBotGame, isAttacker, isDefender, currentRound, isBlocked, playerAttack, opponentDefense, isWaiting, bothChosen]);

  return (
    <div className="football-game-container">
      {/* Фон стадиона */}
      <div className="football-stadium-bg"></div>
      
      {/* Счёт игры */}
      <div className="football-scoreboard">
        <div className={`football-score-team ${isAttacker ? 'football-score-team--you' : ''}`}>
          <div className="football-score-team-badge">⚽</div>
          <div className="football-score-team-info">
            <span className="football-score-team-name">{isAttacker ? 'Вы (Атака)' : 'Соперник (Атака)'}</span>
            <span className="football-score-team-score">{isAttacker ? playerScore : opponentScore}</span>
          </div>
        </div>
        
        <div className="football-round-display">
          <div className="football-round-badge">
            <span className="football-round-current">{Math.min(Math.max(currentRound, 1), totalRounds)}</span>
            <span className="football-round-separator">/</span>
            <span className="football-round-total">{totalRounds}</span>
          </div>
          <span className="football-round-label">удар</span>
        </div>
        
        <div className={`football-score-team ${isDefender ? 'football-score-team--you' : ''}`}>
          <div className="football-score-team-badge">🧤</div>
          <div className="football-score-team-info">
            <span className="football-score-team-name">{isDefender ? 'Вы (Защита)' : 'Соперник (Защита)'}</span>
            <span className="football-score-team-score">{isDefender ? opponentScore : playerScore}</span>
          </div>
        </div>
      </div>
      
      {/* Футбольное поле с воротами */}
      <div className="football-field-wrapper">
        <div className="football-goal-area">
          {/* Сетка ворот */}
          <div className="football-net"></div>
          
          {/* Штанги */}
          <div className="football-post football-post--left"></div>
          <div className="football-post football-post--right"></div>
          <div className="football-crossbar"></div>
          
          {/* Зоны ворот */}
          {positions.map((pos) => (
            <button
              key={pos.id}
              className={`football-zone ${hoveredZone === pos.id ? 'football-zone--hover' : ''} ${playerAttack === pos.id && bothChosen ? 'football-zone--attacked' : ''} ${opponentDefense === pos.id && bothChosen ? 'football-zone--defended' : ''}`}
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
              }}
              onClick={() => isAttacker ? handleAttack(pos.id) : handleDefense(pos.id)}
              onMouseEnter={() => setHoveredZone(pos.id)}
              onMouseLeave={() => setHoveredZone(null)}
              disabled={!isPlayerTurn || isWaiting || isBlocked || (isAttacker && playerAttack !== null) || (isDefender && opponentDefense !== null)}
            >
              <span className="football-zone-icon">{pos.emoji}</span>
              <span className="football-zone-label">{pos.shortLabel}</span>
            </button>
          ))}
          
          {/* Вратарь с анимацией */}
          {goalkeeperPosition && showAnimation && (
            <div 
              className="football-goalkeeper-sprite"
              style={{
                left: `${goalkeeperPosition.x}%`,
                top: `${goalkeeperPosition.y}%`,
              }}
            >
              <div className="football-goalkeeper-body">🧤</div>
            </div>
          )}
          
          {/* Мяч с анимацией */}
          {ballPosition && showAnimation && (
            <div 
              className={`football-ball-sprite ${roundResult === 'scored' ? 'football-ball-sprite--goal' : 'football-ball-sprite--saved'}`}
              style={{
                left: `${ballPosition.x}%`,
                top: `${ballPosition.y}%`,
              }}
            >
              ⚽
            </div>
          )}
        </div>
        
        {/* Газон */}
        <div className="football-grass"></div>
      </div>
      
      {/* Результат раунда */}
      {roundResult && bothChosen && (
        <div className={`football-result-banner ${roundResult === 'scored' ? 'football-result-banner--goal' : 'football-result-banner--save'}`}>
          {roundResult === 'scored' ? (
            <>
              <span className="football-result-icon">⚽</span>
              <span className="football-result-text">ГОООЛ!</span>
            </>
          ) : (
            <>
              <span className="football-result-icon">🧤</span>
              <span className="football-result-text">СЕЙВ! Защитник побеждает!</span>
            </>
          )}
        </div>
      )}
      
      {/* Инструкции */}
      <div className="football-instructions">
        {isAttacker && isPlayerTurn && !isWaiting && !isBlocked && playerAttack === null && (
          <div className="football-instruction-card">
            <div>
              <span className="football-instruction-icon">⚽</span>
              <span className="football-instruction-text">Выберите угол ворот для удара</span>
            </div>
            <span className="football-instruction-hint">Цельтесь в угол, который защитник не выберет!</span>
          </div>
        )}
        
        {isDefender && isPlayerTurn && !isWaiting && !isBlocked && opponentDefense === null && (
          <div className="football-instruction-card">
            <div>
              <span className="football-instruction-icon">🧤</span>
              <span className="football-instruction-text">Выберите угол для прыжка вратаря</span>
            </div>
            <span className="football-instruction-hint">Угадайте, куда полетит мяч, чтобы сделать сейв!</span>
          </div>
        )}
        
        {((isAttacker && playerAttack !== null && !bothChosen) || (isDefender && opponentDefense !== null && !bothChosen)) && (
          <div className="football-instruction-card football-instruction-card--waiting">
            <div className="football-waiting-spinner"></div>
            <span className="football-instruction-text">Ожидание соперника...</span>
          </div>
        )}
      </div>
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
