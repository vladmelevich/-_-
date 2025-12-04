import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

function FootballGame({ rounds, onRoundFinish, onGameFinish, playerRole }) {
  // Football всегда имеет 3 раунда
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
  
  // Преподаватель всегда защита, ученик всегда атака
  const isTeacher = playerRole === 'teacher';
  const isAttacker = !isTeacher; // Ученик атакует
  const isDefender = isTeacher; // Преподаватель защищается

  // 5 позиций: углы (1, 2, 3, 4) и центр сверху (5)
  const positions = [
    { id: 1, label: 'Левый верхний угол' },
    { id: 2, label: 'Правый верхний угол' },
    { id: 3, label: 'Левый нижний угол' },
    { id: 4, label: 'Правый нижний угол' },
    { id: 5, label: 'Центр сверху' }
  ];

  const handleAttack = (positionId) => {
    // Только атакующий (ученик) может выбирать атаку
    if (!isAttacker || !isPlayerTurn || isWaiting || isBlocked || playerAttack !== null) return;
    
    setPlayerAttack(positionId);
    setIsPlayerTurn(false);
    
    // Проверяем, выбрал ли защитник свою позицию
    checkRoundResult();
  };

  const handleDefense = (positionId) => {
    // Только защитник (преподаватель) может выбирать защиту
    if (!isDefender || !isPlayerTurn || isWaiting || isBlocked || opponentDefense !== null) return;
    
    setOpponentDefense(positionId);
    setIsPlayerTurn(false);
    
    // Проверяем, выбрал ли атакующий свою позицию
    checkRoundResult();
  };

  const checkRoundResult = useCallback(() => {
    // Если оба выбрали - показываем результат
    if (playerAttack !== null && opponentDefense !== null && !bothChosen && !isBlocked) {
      setBothChosen(true);
      setIsWaiting(true);
      
      const attackPos = playerAttack;
      const defensePos = opponentDefense;
      
      // Небольшая задержка перед показом результата
      setTimeout(() => {
        const blocked = attackPos === defensePos;
        
        // Если заблокировано - защитник автоматически побеждает весь матч
        if (blocked) {
          setRoundResult('blocked');
          setIsBlocked(true);
          setTimeout(() => {
            // Игрок - атакующий (ученик), соперник - защитник (преподаватель)
            if (onGameFinish) onGameFinish(false); // Атакующий проиграл
          }, 1500);
        } else {
          // Если не заблокировано - атакующий получает очко
          setPlayerScore(prev => prev + 1);
          setRoundResult('scored');
          setIsWaiting(false);
          
          // Автоматический переход к следующему раунду
          setCurrentRound(prevRound => {
            if (prevRound < totalRounds) {
              const nextRound = prevRound + 1;
              setTimeout(() => {
                if (onRoundFinish) {
                  onRoundFinish(prevRound, true);
                }
                setCurrentRound(nextRound);
              }, 2000);
              return prevRound;
            } else {
              // Игра завершена - проверяем победителя
              setIsBlocked(true);
              setTimeout(() => {
                setPlayerScore(prevPlayerScore => {
                  setOpponentScore(prevOpponentScore => {
                    // Атакующий победил, если забил больше голов
                    const attackerWon = prevPlayerScore > prevOpponentScore;
                    if (onGameFinish) onGameFinish(attackerWon);
                    return prevOpponentScore;
                  });
                  return prevPlayerScore;
                });
              }, 1500);
              return prevRound;
            }
          });
        }
      }, 1000);
    }
  }, [playerAttack, opponentDefense, bothChosen, isBlocked, totalRounds, onRoundFinish, onGameFinish]);

  // Сброс состояния при переходе к новому раунду
  useEffect(() => {
    if (currentRound <= totalRounds && !isBlocked) {
      setPlayerAttack(null);
      setOpponentDefense(null);
      setRoundResult(null);
      setBothChosen(false);
      // Оба игрока могут выбирать одновременно (игра в слепую)
      setIsPlayerTurn(true);
      setIsWaiting(false);
      
      // Для бота (защитника) симулируем выбор
      if (isDefender) {
        setTimeout(() => {
          const defensePosition = positions[Math.floor(Math.random() * positions.length)].id;
          setOpponentDefense(defensePosition);
          setIsPlayerTurn(false);
          checkRoundResult();
        }, 500 + Math.random() * 1000); // Случайная задержка для реалистичности
      }
    }
  }, [currentRound, isBlocked, isDefender]);

  // Проверяем результат когда оба выбрали
  useEffect(() => {
    if (playerAttack !== null && opponentDefense !== null && !bothChosen && !isBlocked) {
      checkRoundResult();
    }
  }, [playerAttack, opponentDefense, bothChosen, isBlocked, checkRoundResult]);

  return (
    <div className="football-game">
      <div className="game-score">
        <div className="score-item">
          <span>{isAttacker ? 'Вы (Атака)' : 'Вы (Защита)'}: {isAttacker ? playerScore : opponentScore}</span>
        </div>
        <div className="score-item">
          <span>Раунд {Math.min(currentRound, totalRounds)}/{totalRounds}</span>
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
        <div className="football-instruction">
          Ожидание выбора соперника...
        </div>
      )}
    </div>
  );
}

FootballGame.propTypes = {
  rounds: PropTypes.number.isRequired,
  onRoundFinish: PropTypes.func,
  onGameFinish: PropTypes.func.isRequired,
  playerRole: PropTypes.string
};

export default FootballGame;

