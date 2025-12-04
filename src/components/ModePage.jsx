import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import GameLobby from './GameLobby.jsx';
import GameResult from './GameResult.jsx';
import DiceSumGame from './games/DiceSumGame.jsx';
import DiceAmericanGame from './games/DiceAmericanGame.jsx';
import CoinflipGame from './games/CoinflipGame.jsx';
import NvutiGame from './games/NvutiGame.jsx';
import FootballGame from './games/FootballGame.jsx';
import BlackjackGame from './games/BlackjackGame.jsx';

const modeDescriptions = {
  'dice-sum': 'Dice на сумму - вы кидаете 3 кубика и у кого сумма кубиков больше тот и выигрывает раунд.',
  'dice-american': 'Dice американский - вы кидаете три кубика. Если выпадает 1 2 3 - проигрыш всех раундов, если 4 5 6 - выигрыш всех раундов. Если три одинаковых - победа (если у соперника не три одинаковых). Иначе получаете очки за комбинации.',
  coinflip: 'Coinflip - вы выбираете сторону монетки (орел или решка) и пытаетесь угадать результат подбрасывания.',
  blackjack: 'Blackjack - классическая карточная игра на дуэль. Цель - набрать 21 очко или максимально близкое к этому значение, не превышая его.',
  football: 'Football - соперник выбирает какую клетку защищать, а вы выбираете какую клетку атаковать. Всегда 3 раунда.',
  nvuti: 'Nvuti - вы выбираете числа 1-50 или 51-100, и в каком промежутке выпадет случайное число тот и выигрывает раунд.'
};

function ModePage({ modeId, modeLabel, onBack }) {
  const [rounds, setRounds] = useState(1);
  const [customRounds, setCustomRounds] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [creatorFilter, setCreatorFilter] = useState(() => {
    // Загружаем из localStorage
    const saved = localStorage.getItem('creatorFilter');
    return saved || 'all';
  });
  const [modeFilter, setModeFilter] = useState(false);

  // Сохраняем фильтр создателя в localStorage
  useEffect(() => {
    localStorage.setItem('creatorFilter', creatorFilter);
  }, [creatorFilter]);

  // Состояние лобби и игры
  const [isWaiting, setIsWaiting] = useState(false);
  const [myLobbyId, setMyLobbyId] = useState(null);
  const [gameState, setGameState] = useState(null); // null, 'playing', 'finished'
  const [gameResult, setGameResult] = useState(null); // null, true (win), false (lose)
  const [isCreator, setIsCreator] = useState(false);
  const [currentGameRounds, setCurrentGameRounds] = useState(null);
  const [isBotGame, setIsBotGame] = useState(false);

  // Активные сессии (синхронизация через localStorage и BroadcastChannel)
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem('activeSessions');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Ошибка загрузки сессий:', e);
      return [];
    }
  });

  // Используем BroadcastChannel для синхронизации между вкладками
  useEffect(() => {
    let channel = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        channel = new BroadcastChannel('sessions_channel');
        channel.onmessage = (e) => {
          if (e.data && e.data.type === 'sessionsUpdate' && Array.isArray(e.data.sessions)) {
            setSessions(e.data.sessions);
          }
        };
      }
    } catch (e) {
      console.error('Ошибка создания BroadcastChannel:', e);
    }

    return () => {
      if (channel) {
        channel.close();
      }
    };
  }, []);

  // Синхронизация сессий с localStorage и BroadcastChannel
  useEffect(() => {
    try {
      localStorage.setItem('activeSessions', JSON.stringify(sessions));
      // Отправляем событие для обновления в других вкладках
      window.dispatchEvent(new CustomEvent('sessionsUpdated', { detail: sessions }));
      
      // Отправляем через BroadcastChannel
      if (typeof BroadcastChannel !== 'undefined') {
        try {
          const channel = new BroadcastChannel('sessions_channel');
          channel.postMessage({ type: 'sessionsUpdate', sessions });
          channel.close();
        } catch (e) {
          // Игнорируем ошибки BroadcastChannel
        }
      }
    } catch (e) {
      console.error('Ошибка сохранения сессий:', e);
    }
  }, [sessions]);

  // Слушаем обновления сессий из других вкладок
  useEffect(() => {
    const handleSessionsUpdate = (e) => {
      if (e && e.detail && Array.isArray(e.detail)) {
        setSessions(e.detail);
      }
    };
    
    const handleStorageChange = (e) => {
      if (e.key === 'activeSessions' && e.newValue) {
        try {
          const newSessions = JSON.parse(e.newValue);
          if (Array.isArray(newSessions)) {
            setSessions(newSessions);
          }
        } catch (err) {
          console.error('Ошибка парсинга сессий:', err);
        }
      }
    };
    
    window.addEventListener('sessionsUpdated', handleSessionsUpdate);
    window.addEventListener('storage', handleStorageChange);
    
    // Периодическая проверка localStorage (для надежности)
    const interval = setInterval(() => {
      try {
        const saved = localStorage.getItem('activeSessions');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setSessions(prev => {
              // Обновляем только если есть изменения
              if (JSON.stringify(prev) !== JSON.stringify(parsed)) {
                return parsed;
              }
              return prev;
            });
          }
        }
      } catch (e) {
        // Игнорируем ошибки
      }
    }, 2000);
    
    return () => {
      window.removeEventListener('sessionsUpdated', handleSessionsUpdate);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleRoundsChange = (value) => {
    if (value === 'custom') {
      setShowCustomInput(true);
      setRounds(null);
    } else {
      setShowCustomInput(false);
      setRounds(parseInt(value, 10));
      setCustomRounds('');
    }
  };

  const handleCustomRoundsChange = (value) => {
    setCustomRounds(value);
    const num = parseInt(value, 10);
    if (!isNaN(num) && num > 0 && num % 2 !== 0) {
      setRounds(num);
    } else {
      setRounds(null);
    }
  };

  const handleCreateSession = () => {
    if (!rounds || rounds <= 0 || rounds % 2 === 0) {
      alert('Выберите нечетное количество раундов!');
      return;
    }
    
    if (!playerName.trim()) {
      alert('Введите ваше имя!');
      return;
    }
    
    // Создаем лобби для поиска игроков
    const newLobbyId = Date.now();
    const newSession = {
      id: newLobbyId,
      mode: modeId,
      creator: currentRole,
      creatorName: playerName.trim(),
      rounds: rounds
    };
    
    setSessions(prev => [...prev, newSession]);
    setMyLobbyId(newLobbyId);
    setIsCreator(true);
    setCurrentGameRounds(rounds);
    setIsWaiting(true);
    setIsBotGame(false);
    // НЕ начинаем игру автоматически - ждем присоединения игрока
  };

  const handlePlayWithBot = () => {
    if (!rounds || rounds <= 0 || rounds % 2 === 0) {
      alert('Выберите нечетное количество раундов!');
      return;
    }
    
    // Начинаем игру с ботом сразу
    setCurrentGameRounds(rounds);
    setIsCreator(true);
    setIsBotGame(true);
    setIsWaiting(false); // Не показываем ожидание, игра начинается сразу
    setGameState('playing');
    
    // Создаем лобби для ожидания реального игрока (но игра уже идет с ботом)
    const newLobbyId = Date.now();
    const newSession = {
      id: newLobbyId,
      mode: modeId,
      creator: currentRole,
      creatorName: playerName.trim() || (currentRole === 'student' ? 'Игрок (Ученик)' : 'Игрок (Преподаватель)'),
      rounds: rounds
    };
    
    setSessions(prev => [...prev, newSession]);
    setMyLobbyId(newLobbyId);
  };

  const handleCancelLobby = () => {
    if (myLobbyId) {
      setSessions(prev => prev.filter(s => s.id !== myLobbyId));
      setMyLobbyId(null);
      setIsWaiting(false);
      setIsCreator(false);
      setGameState(null);
      setCurrentGameRounds(null);
    }
  };

  const handleJoinSession = (sessionId) => {
    // Находим сессию для получения количества раундов
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      // Проверка совместимости ролей
      if (session.creator === currentRole) {
        alert('Вы не можете присоединиться к сессии, созданной пользователем с такой же ролью!');
        return;
      }
      
      // Если режим сессии отличается от текущего, нужно перейти на страницу этого режима
      if (session.mode !== modeId) {
        window.sessionToJoin = { rounds: session.rounds, sessionId: sessionId, modeId: session.mode };
        window.dispatchEvent(new CustomEvent('modeChange', { detail: { modeId: session.mode, startGame: true } }));
        return;
      }
      
      setCurrentGameRounds(session.rounds);
      // Удаляем сессию из списка перед началом игры
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      setIsWaiting(false);
      setGameState('playing');
      setIsCreator(false);
      
      // Отправляем событие для создания сессии, чтобы убрать ожидание у создателя
      window.dispatchEvent(new CustomEvent('playerJoined', { detail: { sessionId } }));
    }
  };
  
  // Слушаем событие присоединения игрока
  useEffect(() => {
    const handlePlayerJoined = (e) => {
      if (e.detail && e.detail.sessionId === myLobbyId && isWaiting && isCreator) {
        setIsWaiting(false);
        setGameState('playing');
      }
    };
    
    window.addEventListener('playerJoined', handlePlayerJoined);
    return () => window.removeEventListener('playerJoined', handlePlayerJoined);
  }, [myLobbyId, isWaiting, isCreator]);

  // Проверяем, нужно ли сразу начать игру (при подключении к сессии другого режима)
  useEffect(() => {
    const handleStartGame = () => {
      if (window.sessionToJoin && window.sessionToJoin.modeId === modeId) {
        const { rounds: sessionRounds, sessionId } = window.sessionToJoin;
        setCurrentGameRounds(sessionRounds);
        setIsWaiting(false);
        setGameState('playing');
        setIsCreator(false);
        // Удаляем сессию из списка
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        delete window.sessionToJoin;
      }
    };
    
    window.addEventListener('startGame', handleStartGame);
    
    // Также проверяем сразу при монтировании, если есть сохраненная сессия
    if (window.sessionToJoin && window.sessionToJoin.modeId === modeId) {
      setTimeout(handleStartGame, 100);
    }
    
    return () => {
      window.removeEventListener('startGame', handleStartGame);
    };
  }, [modeId]);

  // Очистка при уходе со страницы
  useEffect(() => {
    return () => {
      if (myLobbyId) {
        // Здесь можно отправить запрос на удаление лобби с сервера
      }
    };
  }, [myLobbyId]);

  // Фильтрация сессий
  const filteredSessions = sessions.filter((session) => {
    // Фильтр по режиму
    if (modeFilter && session.mode !== modeId) return false;
    // Фильтр по создателю
    if (creatorFilter !== 'all' && session.creator !== creatorFilter) return false;
    return true;
  });

  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('selectedRole') || 'student';
  });

  // Слушаем изменения роли в localStorage
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'selectedRole') {
        setCurrentRole(e.newValue || 'student');
      }
    };

    // Слушаем изменения в localStorage (для других вкладок)
    window.addEventListener('storage', handleStorageChange);
    
    // Кастомное событие для изменений в том же окне
    const handleRoleChange = () => {
      const newRole = localStorage.getItem('selectedRole') || 'student';
      setCurrentRole(newRole);
    };
    
    window.addEventListener('roleChanged', handleRoleChange);
    
    // Также проверяем изменения через интервал (fallback)
    const interval = setInterval(() => {
      const newRole = localStorage.getItem('selectedRole') || 'student';
      if (newRole !== currentRole) {
        setCurrentRole(newRole);
      }
    }, 200);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('roleChanged', handleRoleChange);
      clearInterval(interval);
    };
  }, [currentRole]);

  // Симуляция начала игры (когда соперник присоединяется)
  const handleGameStart = () => {
    if (isWaiting && isCreator) {
      setIsWaiting(false);
      setGameState('playing');
    }
  };

  // Обработка завершения игры
  const handleGameFinish = (isWinner) => {
    setGameState('finished');
    setGameResult(isWinner);
    // Удаляем лобби из списка
    if (myLobbyId) {
      setSessions(sessions.filter(s => s.id !== myLobbyId));
      setMyLobbyId(null);
    }
  };

  // Обработка завершения раунда
  const handleRoundFinish = (round, won) => {
    // Можно добавить логику для отображения результатов раунда
    console.log(`Раунд ${round} завершен. Вы ${won ? 'выиграли' : 'проиграли'}`);
  };

  // Рендер игрового компонента в зависимости от режима
  const renderGame = () => {
    if (!gameState || gameState !== 'playing' || !currentGameRounds) return null;

    const gameProps = {
      rounds: currentGameRounds,
      onRoundFinish: handleRoundFinish,
      onGameFinish: handleGameFinish,
      playerRole: currentRole
    };

    switch (modeId) {
      case 'dice-sum':
        return <DiceSumGame {...gameProps} />;
      case 'dice-american':
        return <DiceAmericanGame {...gameProps} />;
      case 'coinflip':
        return <CoinflipGame {...gameProps} />;
      case 'nvuti':
        return <NvutiGame {...gameProps} />;
      case 'football':
        return <FootballGame {...gameProps} />;
      case 'blackjack':
        return <BlackjackGame {...gameProps} />;
      default:
        return <div>Режим не найден</div>;
    }
  };

  // Закрытие результата игры
  const handleCloseResult = () => {
    setGameResult(null);
    setGameState(null);
    setIsCreator(false);
  };

  return (
    <div className="mode-page">
      {isWaiting && <GameLobby onCancel={handleCancelLobby} isBotGame={isBotGame} />}
      {gameResult !== null && <GameResult isWinner={gameResult} onClose={handleCloseResult} />}
      <div className="mode-page__header">
        <button className="mode-page__back-button" type="button" onClick={onBack}>
          ← Назад
        </button>
        <h1 className="mode-page__title">{modeLabel}</h1>
        <div></div>
      </div>
      <div className={`mode-page__content ${isWaiting ? 'mode-page__content--dimmed' : ''}`}>
        {/* Левая панель - описание режима */}
        <div className="mode-page__sidebar">
          <div className="mode-page__description">
            <h2>{modeLabel}</h2>
            <p>{modeDescriptions[modeId] || 'Описание режима'}</p>
          </div>
        </div>

        {/* Центральная часть - игровое поле */}
        <div className="mode-page__game-area">
          <div className="mode-page__game-field">
            {gameState === 'playing' ? (
              <div className="game-active">
                {renderGame()}
              </div>
            ) : (
              <div className="game-field-placeholder">
                <p>Игровое поле</p>
                <p className="game-field-placeholder__subtitle">Создайте сессию или присоединитесь к существующей</p>
              </div>
            )}
          </div>

          {/* Выбор количества раундов */}
          {modeId !== 'football' ? (
            <div className="mode-page__rounds-selection">
              <label className="rounds-label">Количество раундов:</label>
              <div className="rounds-buttons">
                {[1, 3, 5, 7].map((num) => (
                  <button
                    key={num}
                    type="button"
                    className={`round-button ${rounds === num ? 'round-button--active' : ''}`}
                    onClick={() => handleRoundsChange(num)}
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  className={`round-button ${showCustomInput ? 'round-button--active' : ''}`}
                  onClick={() => handleRoundsChange('custom')}
                >
                  Другое
                </button>
              </div>
              {showCustomInput && (
                <div className="custom-rounds-input">
                  <input
                    type="number"
                    min="1"
                    step="2"
                    value={customRounds}
                    onChange={(e) => handleCustomRoundsChange(e.target.value)}
                    placeholder="Введите нечетное число"
                    className="custom-rounds-input__field"
                  />
                  {customRounds && rounds && rounds % 2 !== 0 && (
                    <span className="custom-rounds-input__valid">✓</span>
                  )}
                  {customRounds && (!rounds || rounds % 2 === 0) && (
                    <span className="custom-rounds-input__invalid">Число должно быть нечетным</span>
                  )}
                </div>
              )}
              <div className="player-name-input">
                <label className="player-name-label">Ваше имя:</label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Введите ваше имя"
                  className="player-name-input__field"
                />
              </div>
              <div className="session-buttons">
                <button
                  className="create-session-button"
                  type="button"
                  onClick={handleCreateSession}
                  disabled={!rounds || rounds <= 0 || rounds % 2 === 0}
                >
                  Создать сессию
                </button>
                <button
                  className="create-session-button create-session-button--bot"
                  type="button"
                  onClick={handlePlayWithBot}
                  disabled={!rounds || rounds <= 0 || rounds % 2 === 0}
                >
                  Играть с ботом
                </button>
              </div>
            </div>
          ) : (
            <div className="mode-page__rounds-selection">
              <div className="football-rounds-info">
                <p>Football всегда играется в 3 раунда</p>
              </div>
              <button
                className="create-session-button"
                type="button"
                onClick={() => {
                  // Для football всегда 3 раунда
                  setRounds(3);
                  const newLobbyId = Date.now();
                  const newSession = {
                    id: newLobbyId,
                    mode: modeId,
                    creator: currentRole,
                    creatorName: currentRole === 'student' ? 'Вы (Ученик)' : 'Вы (Преподаватель)',
                    rounds: 3
                  };
                  
                  setSessions([...sessions, newSession]);
                  setMyLobbyId(newLobbyId);
                  setIsCreator(true);
                  setCurrentGameRounds(3);
                  setIsWaiting(true);
                  
                  // Симуляция присоединения соперника через 3 секунды (для демо)
                  setTimeout(() => {
                    setIsWaiting(false);
                    setGameState('playing');
                    // Удаляем лобби из списка при начале игры
                    setSessions(prev => prev.filter(s => s.id !== newLobbyId));
                  }, 3000);
                }}
              >
                Создать сессию
              </button>
            </div>
          )}
        </div>

        {/* Правая панель - активные сессии */}
        <div className="mode-page__sessions">
          <div className="sessions-header">
            <h3>Активные сессии</h3>
          </div>
          <div className="sessions-filters">
            <select
              className="creator-filter-select"
              value={creatorFilter}
              onChange={(e) => setCreatorFilter(e.target.value)}
            >
              <option value="all">Все</option>
              <option value="student">Ученики</option>
              <option value="teacher">Преподаватели</option>
            </select>
            <button
              className={`filter-mode-button ${modeFilter ? 'filter-mode-button--active' : ''}`}
              type="button"
              onClick={() => setModeFilter(!modeFilter)}
            >
              Только {modeLabel}
            </button>
          </div>
          <div className="sessions-list">
            {filteredSessions.length === 0 ? (
              <div className="no-sessions">Нет активных сессий</div>
            ) : (
              filteredSessions.map((session) => {
                const canJoin = currentRole !== session.creator;
                return (
                  <div key={session.id} className="session-card">
                    <div className="session-card__mode">{session.mode}</div>
                    <div className="session-card__creator">
                      <span className="session-card__creator-label">
                        {session.creator === 'student' ? 'Ученик' : 'Преподаватель'}:
                      </span>
                      <span className="session-card__creator-name">{session.creatorName}</span>
                    </div>
                    <div className="session-card__rounds">Раундов: {session.rounds}</div>
                    <button
                      className="session-card__join-button"
                      type="button"
                      disabled={!canJoin}
                      onClick={() => canJoin && handleJoinSession(session.id)}
                    >
                      {canJoin ? 'Присоединиться' : 'Недоступно'}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

ModePage.propTypes = {
  modeId: PropTypes.string.isRequired,
  modeLabel: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired
};

export default ModePage;

