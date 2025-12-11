import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import GameLobby from './GameLobby.jsx';
import GameResult from './GameResult.jsx';
import DiceSumGame from './games/DiceSumGame.jsx';
import DiceAmericanGame from './games/DiceAmericanGame.jsx';
import CoinflipGame from './games/CoinflipGame.jsx';
import NvutiGame from './games/NvutiGame.jsx';
import FootballGame from './games/FootballGame.jsx';
import BlackjackGame from './games/BlackjackGame.jsx';
import { useLanguage } from '../context/LanguageContext';
import { log, logError, logAction, logState, logData, validateAndLog } from '../utils/devMode.js';

const modeDescriptions = {
  'dice-sum': 'Dice на сумму - вы кидаете 3 кубика и у кого сумма кубиков больше тот и выигрывает раунд.',
  'dice-american': 'Dice американский - вы кидаете три кубика. Если выпадает 1 2 3 - проигрыш всех раундов, если 4 5 6 - выигрыш всех раундов. Если три одинаковых - победа (если у соперника не три одинаковых). Иначе получаете очки за комбинации.',
  coinflip: 'Coinflip - вы выбираете сторону монетки (орел или решка) и пытаетесь угадать результат подбрасывания.',
  blackjack: 'Blackjack - классическая карточная игра на дуэль. Цель - набрать 21 очко или максимально близкое к этому значение, не превышая его.',
  football: 'Football - соперник выбирает какую клетку защищать, а вы выбираете какую клетку атаковать. Всегда 3 раунда.',
  nvuti: 'Nvuti - вы выбираете числа 1-50 или 51-100, и в каком промежутке выпадет случайное число тот и выигрывает раунд.'
};

function ModePage({ modeId, modeLabel, onBack }) {
  const { t } = useLanguage();
  
  // Базовые состояния
  const [playerRole, setPlayerRole] = useState(() => {
    return localStorage.getItem('selectedRole') || 'student';
  });
  
  const [rounds, setRounds] = useState(1);
  const [customRounds, setCustomRounds] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [playerName, setPlayerName] = useState('');
  
  // Состояние игры
  const [gameState, setGameState] = useState('idle'); // 'idle', 'waiting', 'playing', 'finished'
  const [gameRounds, setGameRounds] = useState(null);
  const [gameResult, setGameResult] = useState(null);
  const [isBotGame, setIsBotGame] = useState(false);
  
  // Сессии
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem('activeSessions');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Валидация и очистка сессий
        if (Array.isArray(parsed)) {
          // Фильтруем только валидные сессии с обязательными полями
          const validSessions = parsed.filter(s => {
            return s && 
                   s.id && 
                   s.mode && 
                   s.creator && 
                   s.creatorName && 
                   s.rounds && 
                   s.createdAt;
          });
          return validSessions;
        }
      }
      return [];
    } catch (e) {
      logError('storage', 'Ошибка загрузки сессий', e);
      return [];
    }
  });
  
  const [mySessionId, setMySessionId] = useState(null);
  const [creatorFilter, setCreatorFilter] = useState(() => {
    return localStorage.getItem('creatorFilter') || 'all';
  });
  const [modeFilter, setModeFilter] = useState(false);
  
  // Ссылка для предотвращения дублирования
  const sessionChannelRef = useRef(null);
  
  // Инициализация BroadcastChannel
  useEffect(() => {
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        sessionChannelRef.current = new BroadcastChannel('sessions_channel');
        sessionChannelRef.current.onmessage = (e) => {
          if (e.data?.type === 'sessionsUpdate' && Array.isArray(e.data.sessions)) {
            setSessions(e.data.sessions);
          }
        };
      } catch (e) {
        logError('broadcast', 'Ошибка BroadcastChannel', e);
      }
    }
    
    // Очистка старых сессий при загрузке
    try {
      const saved = localStorage.getItem('activeSessions');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Фильтруем только валидные сессии (не старше 1 часа)
        const now = Date.now();
        const validSessions = Array.isArray(parsed) ? parsed.filter(s => {
          return s && s.id && s.mode && s.createdAt && (now - s.createdAt) < 3600000;
        }) : [];
        if (validSessions.length !== parsed.length) {
          localStorage.setItem('activeSessions', JSON.stringify(validSessions));
          setSessions(validSessions);
        }
      }
    } catch (e) {
      logError('storage', 'Ошибка очистки сессий', e);
      localStorage.removeItem('activeSessions');
      setSessions([]);
    }
    
    return () => {
      if (sessionChannelRef.current) {
        sessionChannelRef.current.close();
      }
    };
  }, []);
  
  // Синхронизация сессий
  useEffect(() => {
    try {
      // Валидация сессий перед сохранением
      if (!Array.isArray(sessions)) {
        logError('data', 'Sessions не является массивом', { sessions });
        return;
      }
      
      const sessionsData = JSON.stringify(sessions);
      localStorage.setItem('activeSessions', sessionsData);
      logData('sessionsSaved', { count: sessions.length, sessions });
      
      window.dispatchEvent(new CustomEvent('sessionsUpdated', { detail: sessions }));
      logAction('sessionsUpdatedEvent', { count: sessions.length });
      
      if (sessionChannelRef.current) {
        sessionChannelRef.current.postMessage({ type: 'sessionsUpdate', sessions });
        logAction('broadcastChannelMessage', { type: 'sessionsUpdate' });
      }
    } catch (e) {
      logError('storage', 'Ошибка сохранения сессий', e);
    }
  }, [sessions]);
  
  // Слушаем обновления сессий
  useEffect(() => {
    const handleUpdate = (e) => {
      if (e?.detail && Array.isArray(e.detail)) {
        setSessions(e.detail);
      }
    };
    
    const handleStorage = (e) => {
      if (e.key === 'activeSessions' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setSessions(parsed);
          }
        } catch (e) {
          console.error('Ошибка парсинга:', e);
        }
      }
    };
    
    window.addEventListener('sessionsUpdated', handleUpdate);
    window.addEventListener('storage', handleStorage);
    
    return () => {
      window.removeEventListener('sessionsUpdated', handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);
  
  // Слушаем изменения роли
  useEffect(() => {
    const handleRoleChange = () => {
      const newRole = localStorage.getItem('selectedRole') || 'student';
      setPlayerRole(newRole);
    };
    
    const handleStorage = (e) => {
      if (e.key === 'selectedRole') {
        setPlayerRole(e.newValue || 'student');
      }
    };
    
    window.addEventListener('roleChanged', handleRoleChange);
    window.addEventListener('storage', handleStorage);
    
    return () => {
      window.removeEventListener('roleChanged', handleRoleChange);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);
  
  // Сохранение фильтра
  useEffect(() => {
    localStorage.setItem('creatorFilter', creatorFilter);
  }, [creatorFilter]);
  
  // Обработчики
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
    logAction('createSession', { modeId, playerRole, rounds, playerName });
    
    const finalRounds = modeId === 'football' ? 3 : rounds;
    
    // Валидация данных
    const validation = validateAndLog(
      { rounds: finalRounds, playerName: playerName.trim() },
      {
        rounds: { required: true, type: 'number', min: 1, custom: (val) => val % 2 !== 0 },
        playerName: { required: true, type: 'string', custom: (val) => val.length > 0 }
      },
      'handleCreateSession'
    );
    
    if (!validation.valid) {
      logError('validation', 'Ошибка валидации при создании сессии', validation.errors);
      alert(validation.errors.join('\n'));
      return;
    }
    
    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newSession = {
        id: sessionId,
        mode: modeId,
        creator: playerRole,
        creatorName: playerName.trim(),
        rounds: finalRounds,
        createdAt: Date.now()
      };
      
      logData('sessionCreated', newSession);
      
      setSessions(prev => {
        const updated = [...prev, newSession];
        logState('ModePage', 'sessions', updated);
        return updated;
      });
      
      setMySessionId(sessionId);
      setGameRounds(finalRounds);
      setGameState('waiting');
      setIsBotGame(false);
      
      logAction('sessionCreated', { sessionId, modeId });
    } catch (error) {
      logError('session', 'Ошибка при создании сессии', error);
      alert('Ошибка при создании сессии. Попробуйте еще раз.');
    }
  };
  
  const handlePlayWithBot = () => {
    logAction('playWithBot', { modeId, playerRole, rounds, playerName });
    
    const finalRounds = modeId === 'football' ? 3 : rounds;
    
    // Валидация данных
    const validation = validateAndLog(
      { rounds: finalRounds },
      {
        rounds: { required: true, type: 'number', min: 1, custom: (val) => val % 2 !== 0 }
      },
      'handlePlayWithBot'
    );
    
    if (!validation.valid) {
      logError('validation', 'Ошибка валидации при игре с ботом', validation.errors);
      alert(validation.errors.join('\n'));
      return;
    }
    
    try {
      // Игра с ботом - не создаем сессию, сразу запускаем игру
      setGameRounds(finalRounds);
      setIsBotGame(true);
      setGameState('playing');
      
      logAction('botGameStarted', { modeId, playerRole, rounds: finalRounds });
    } catch (error) {
      logError('game', 'Ошибка при запуске игры с ботом', error);
      alert('Ошибка при запуске игры. Попробуйте еще раз.');
    }
  };
  
  const handleCancelLobby = () => {
    if (mySessionId) {
      setSessions(prev => prev.filter(s => s.id !== mySessionId));
      setMySessionId(null);
      setGameState('idle');
      setGameRounds(null);
    }
  };
  
  const handleJoinSession = (sessionId) => {
    logAction('joinSession', { sessionId, playerRole });
    
    if (!sessionId || typeof sessionId !== 'string') {
      logError('validation', 'Неверный sessionId', { sessionId });
      return;
    }
    
    const session = sessions.find(s => s.id === sessionId);
    
    if (!session) {
      logError('session', 'Сессия не найдена', { sessionId, availableSessions: sessions.map(s => s.id) });
      alert('Сессия не найдена');
      return;
    }
    
    // Валидация сессии
    const sessionValidation = validateAndLog(
      session,
      {
        id: { required: true, type: 'string' },
        mode: { required: true, type: 'string' },
        creator: { required: true, type: 'string' },
        rounds: { required: true, type: 'number', min: 1 }
      },
      'handleJoinSession'
    );
    
    if (!sessionValidation.valid) {
      logError('validation', 'Неверные данные сессии', sessionValidation.errors);
      alert('Ошибка: неверные данные сессии');
      return;
    }
    
    if (session.creator === playerRole) {
      logError('session', 'Попытка присоединиться к сессии с такой же ролью', { session, playerRole });
      alert('Вы не можете присоединиться к сессии с такой же ролью!');
      return;
    }
    
    try {
      // Сохраняем информацию о сессии перед удалением (для создания игры)
      const sessionInfo = {
        sessionId,
        rounds: session.rounds,
        mode: session.mode,
        creatorName: session.creatorName || 'Игрок',
        creator: session.creator
      };
      
      // Удаляем сессию из списка и сохраняем в localStorage
      setSessions(prev => {
        const updated = prev.filter(s => s.id !== sessionId);
        logState('ModePage', 'sessions', updated);
        // Сохраняем сразу в localStorage для синхронизации
        try {
          localStorage.setItem('activeSessions', JSON.stringify(updated));
          // Отправляем через BroadcastChannel
          if (sessionChannelRef.current) {
            sessionChannelRef.current.postMessage({ type: 'sessionsUpdate', sessions: updated });
          }
        } catch (e) {
          logError('storage', 'Ошибка сохранения при присоединении', e);
        }
        return updated;
      });
      
      // Уведомляем создателя через несколько каналов
      const joinEvent = new CustomEvent('playerJoined', { 
        detail: { 
          sessionId,
          rounds: session.rounds,
          mode: session.mode,
          creatorName: session.creatorName
        } 
      });
      window.dispatchEvent(joinEvent);
      logAction('playerJoinedEvent', { sessionId, rounds: session.rounds, creatorName: session.creatorName });
      
      // Также сохраняем в localStorage для синхронизации между вкладками
      try {
        localStorage.setItem('playerJoinedSession', JSON.stringify({
          sessionId,
          rounds: session.rounds,
          mode: session.mode,
          timestamp: Date.now()
        }));
        // Удаляем через 5 секунд
        setTimeout(() => {
          localStorage.removeItem('playerJoinedSession');
        }, 5000);
      } catch (e) {
        logError('storage', 'Ошибка сохранения события присоединения', e);
      }
      
      // Начинаем игру у присоединившегося игрока
      setGameRounds(session.rounds);
      setIsBotGame(false);
      setGameState('playing');
      
      logAction('gameStarted', { sessionId, mode: session.mode, rounds: session.rounds });
    } catch (error) {
      logError('session', 'Ошибка при присоединении к сессии', error);
      alert('Ошибка при присоединении к сессии. Попробуйте еще раз.');
    }
  };
  
  // Слушаем присоединение игрока
  useEffect(() => {
    const handlePlayerJoined = (e) => {
      const detail = e.detail;
      if (detail?.sessionId === mySessionId && gameState === 'waiting') {
        logAction('creatorReceivedJoin', { sessionId: detail.sessionId, rounds: detail.rounds });
        setGameRounds(detail.rounds || gameRounds);
        setGameState('playing');
        setIsBotGame(false);
      }
    };
    
    // Также проверяем localStorage на наличие события присоединения
    const checkLocalStorageJoin = () => {
      try {
        const saved = localStorage.getItem('playerJoinedSession');
        if (saved) {
          const joinData = JSON.parse(saved);
          // Проверяем что событие свежее (не старше 5 секунд)
          if (joinData.sessionId === mySessionId && 
              gameState === 'waiting' && 
              Date.now() - joinData.timestamp < 5000) {
            logAction('creatorReceivedJoinFromStorage', { sessionId: joinData.sessionId, rounds: joinData.rounds });
            setGameRounds(joinData.rounds || gameRounds);
            setGameState('playing');
            setIsBotGame(false);
            localStorage.removeItem('playerJoinedSession');
          }
        }
      } catch (e) {
        // Игнорируем ошибки
      }
    };
    
    window.addEventListener('playerJoined', handlePlayerJoined);
    
    // Проверяем сразу и периодически
    checkLocalStorageJoin();
    const interval = setInterval(checkLocalStorageJoin, 500);
    
    return () => {
      window.removeEventListener('playerJoined', handlePlayerJoined);
      clearInterval(interval);
    };
  }, [mySessionId, gameState, gameRounds]);
  
  const handleGameFinish = (isWinner) => {
    logAction('gameFinished', { isWinner, modeId, gameRounds, mySessionId });
    
    // Валидация результата
    if (typeof isWinner !== 'boolean') {
      logError('validation', 'Неверный тип результата игры', { isWinner });
      return;
    }
    
    setGameState('finished');
    setGameResult(isWinner);
    
    if (mySessionId) {
      setSessions(prev => {
        const updated = prev.filter(s => s.id !== mySessionId);
        logState('ModePage', 'sessions', updated);
        return updated;
      });
      setMySessionId(null);
    }
  };
  
  const handleRoundFinish = (round, won) => {
    // Логика завершения раунда (можно расширить)
  };
  
  const handleCloseResult = () => {
    setGameResult(null);
    setGameState('idle');
    setGameRounds(null);
  };
  
  // Рендер игры
  const renderGame = () => {
    if (gameState !== 'playing' || !gameRounds || gameRounds <= 0) {
      log('game', 'Игра не может быть запущена', { gameState, gameRounds });
      return null;
    }
    
    // Валидация перед рендером
    if (!modeId || !playerRole) {
      logError('game', 'Отсутствуют обязательные параметры', { modeId, playerRole });
      return <div>Ошибка: отсутствуют параметры игры</div>;
    }
    
    const gameProps = {
      rounds: gameRounds,
      onRoundFinish: handleRoundFinish,
      onGameFinish: handleGameFinish,
      playerRole: playerRole,
      isBotGame: isBotGame
    };
    
    try {
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
          logError('game', 'Неизвестный режим игры', { modeId });
          return <div>Режим не найден: {modeId}</div>;
      }
    } catch (error) {
      logError('game', 'Ошибка при рендере игры', error);
      return <div>Ошибка при загрузке игры. Попробуйте перезагрузить страницу.</div>;
    }
  };
  
  // Фильтрация сессий
  const filteredSessions = sessions.filter((session) => {
    if (modeFilter && session.mode !== modeId) return false;
    if (creatorFilter !== 'all' && session.creator !== creatorFilter) return false;
    return true;
  });
  
  return (
    <div className="mode-page">
      {gameState === 'waiting' && <GameLobby onCancel={handleCancelLobby} isBotGame={isBotGame} />}
      {gameResult !== null && <GameResult isWinner={gameResult} onClose={handleCloseResult} />}
      
      <div className="mode-page__header">
        <button className="mode-page__back-button" type="button" onClick={onBack}>
          ← {t('back')}
        </button>
        <h1 className="mode-page__title">{modeLabel}</h1>
        <div></div>
      </div>
      
      <div className={`mode-page__content ${gameState === 'waiting' ? 'mode-page__content--dimmed' : ''}`}>
        <div className="mode-page__sidebar">
          <div className="mode-page__description">
            <h2>{modeLabel}</h2>
            <p>{modeDescriptions[modeId] || 'Описание режима'}</p>
          </div>
        </div>
        
        <div className="mode-page__game-area">
          <div className="mode-page__game-field">
            {gameState === 'playing' ? (
              <div className="game-active">
                {renderGame()}
              </div>
            ) : (
              <div className="game-field-placeholder">
                <p>{t('gameField')}</p>
                <p className="game-field-placeholder__subtitle">{t('createOrJoin')}</p>
              </div>
            )}
          </div>
          
          {modeId !== 'football' ? (
            <div className="mode-page__rounds-selection">
              <label className="rounds-label">{t('roundsCount')}</label>
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
                    {t('other')}
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
                    placeholder={t('enterOddNumber')}
                    className="custom-rounds-input__field"
                  />
                  {customRounds && rounds && rounds % 2 !== 0 && (
                    <span className="custom-rounds-input__valid">✓</span>
                  )}
                  {customRounds && (!rounds || rounds % 2 === 0) && (
                    <span className="custom-rounds-input__invalid">{t('mustBeOdd')}</span>
                  )}
                </div>
              )}
              <div className="player-name-input">
                <label className="player-name-label">{t('yourName')}:</label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder={t('enterYourName')}
                  className="player-name-input__field"
                />
              </div>
              <div className="session-buttons">
                <button
                  className="create-session-button"
                  type="button"
                  onClick={handleCreateSession}
                  disabled={!rounds || rounds <= 0 || rounds % 2 === 0 || gameState === 'playing' || gameState === 'waiting'}
                >
                  {t('createSession')}
                </button>
                <button
                  className="create-session-button create-session-button--bot"
                  type="button"
                  onClick={handlePlayWithBot}
                  disabled={!rounds || rounds <= 0 || rounds % 2 === 0 || gameState === 'playing' || gameState === 'waiting'}
                >
                  {t('playWithBot')}
                </button>
              </div>
            </div>
          ) : (
            <div className="mode-page__rounds-selection">
              <div className="football-rounds-info">
                <p>{t('always3Rounds')}</p>
              </div>
              <div className="player-name-input">
                <label className="player-name-label">{t('yourName')}:</label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder={t('enterYourName')}
                  className="player-name-input__field"
                />
              </div>
              <div className="session-buttons">
                <button
                  className="create-session-button"
                  type="button"
                  onClick={handleCreateSession}
                  disabled={gameState === 'playing' || gameState === 'waiting'}
                >
                  {t('createSession')}
                </button>
                <button
                  className="create-session-button create-session-button--bot"
                  type="button"
                  onClick={handlePlayWithBot}
                  disabled={gameState === 'playing' || gameState === 'waiting'}
                >
                  {t('playWithBot')}
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="mode-page__sessions">
          <div className="sessions-header">
            <h3>{t('activeSessions')}</h3>
          </div>
          <div className="sessions-filters">
            <select
              className="creator-filter-select"
              value={creatorFilter}
              onChange={(e) => setCreatorFilter(e.target.value)}
            >
              <option value="all">{t('all')}</option>
              <option value="student">{t('students')}</option>
              <option value="teacher">{t('teachers')}</option>
            </select>
            <button
              className={`filter-mode-button ${modeFilter ? 'filter-mode-button--active' : ''}`}
              type="button"
              onClick={() => setModeFilter(!modeFilter)}
            >
              {t('onlyThisGame', { game: modeLabel })}
            </button>
          </div>
          <div className="sessions-list">
            {filteredSessions.length === 0 ? (
              <div className="no-sessions">{t('noActiveSessions')}</div>
            ) : (
              filteredSessions.map((session) => {
                const canJoin = playerRole !== session.creator;
                return (
                  <div key={session.id} className="session-card">
                    <div className="session-card__mode">{session.mode}</div>
                    <div className="session-card__creator">
                      <span className="session-card__creator-label">
                        {session.creator === 'student' ? t('students') : t('teachers')}:
                      </span>
                      <span className="session-card__creator-name">{session.creatorName}</span>
                    </div>
                    <div className="session-card__rounds">{t('rounds')}: {session.rounds}</div>
                    <button
                      className="session-card__join-button"
                      type="button"
                      disabled={!canJoin || gameState === 'playing' || gameState === 'waiting'}
                      onClick={() => canJoin && handleJoinSession(session.id)}
                    >
                      {canJoin ? t('join') : t('unavailable')}
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
