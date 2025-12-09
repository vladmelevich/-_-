import { useState, useEffect, useCallback } from 'react';
import Topbar from './components/Topbar.jsx';
import SubjectSelector from './components/SubjectSelector.jsx';
import CategoryPills from './components/CategoryPills.jsx';
import GameGrid from './components/GameGrid.jsx';
import ModePage from './components/ModePage.jsx';
import { log } from './utils/devMode.js';
import './styles.css';

const gameModes = [
  { id: 'dice-sum', label: 'Dice на сумму', icon: 'grid' },
  { id: 'dice-american', label: 'Dice американский', icon: 'grid' },
  { id: 'coinflip', label: 'Coinflip', icon: 'grid' },
  { id: 'blackjack', label: 'Blackjack', icon: 'cards' },
  { id: 'football', label: 'Football', icon: 'zap' },
  { id: 'nvuti', label: 'Nvuti', icon: 'star' }
];

const games = [
  { id: 1, title: 'Dice на сумму', provider: 'Pragmatic Play', tag: 'Drops & Wins', cover: 'sugar', subject: 'ТРПО', mode: 'dice-sum' },
  { id: 2, title: 'Blackjack', provider: 'Endorphina', cover: 'hell', subject: 'КПиЯП', mode: 'blackjack' },
  { id: 3, title: 'Football', provider: 'Pragmatic Play', cover: 'zeus', subject: 'ПСИИП', mode: 'football' },
  { id: 4, title: 'Nvuti', provider: 'Spribe', cover: 'astronaut', subject: 'ТРПО', mode: 'nvuti' },
  { id: 5, title: 'Dice американский', provider: 'Evoplay', tag: 'Bonus Game', cover: 'chicken', subject: 'КПиЯП', mode: 'dice-american' },
  { id: 6, title: 'Blackjack', provider: '3 Oaks Gaming', cover: 'coins', subject: 'ПСИИП', mode: 'blackjack' },
  { id: 7, title: 'Football', provider: 'Pragmatic Play', cover: 'olympus', subject: 'ТРПО', mode: 'football' },
  { id: 8, title: 'Nvuti', provider: 'Hacksaw', cover: 'king', subject: 'КПиЯП', mode: 'nvuti' },
  { id: 9, title: 'Dice на сумму', provider: 'Pragmatic Play', tag: 'Drops & Wins', cover: 'dog', subject: 'ПСИИП', mode: 'dice-sum' },
  { id: 10, title: 'Coinflip', provider: 'Spribe', cover: 'sugar', subject: 'ТРПО', mode: 'coinflip' }
];

function App() {
  // Инициализация
  useEffect(() => {
    log('system', 'Приложение инициализировано');
  }, []);
  
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);
  const [currentPage, setCurrentPage] = useState('main'); // 'main' или 'mode'
  const [currentMode, setCurrentMode] = useState(null);

  // Получаем доступные режимы для выбранного предмета
  const getAvailableModes = () => {
    if (!selectedSubject) return gameModes;
    const subjectGames = games.filter((game) => game.subject === selectedSubject);
    const availableModeIds = [...new Set(subjectGames.map((game) => game.mode))];
    return gameModes.filter((mode) => availableModeIds.includes(mode.id));
  };

  // Получаем доступные предметы для выбранного режима
  const getAvailableSubjects = () => {
    if (!selectedMode) return ['ТРПО', 'КПиЯП', 'ПСИИП'];
    const modeGames = games.filter((game) => game.mode === selectedMode);
    return [...new Set(modeGames.map((game) => game.subject))];
  };

  const handleSubjectSelect = (subject) => {
    // Если предмет уже выбран, снимаем выбор
    if (selectedSubject === subject) {
      setSelectedSubject(null);
      return;
    }
    setSelectedSubject(subject);
    // Если выбранный режим не совместим с новым предметом, сбрасываем режим
    if (selectedMode) {
      const subjectGames = games.filter((game) => game.subject === subject);
      const availableModes = [...new Set(subjectGames.map((game) => game.mode))];
      if (!availableModes.includes(selectedMode)) {
        setSelectedMode(null);
      }
    }
  };

  const handleModeSelect = (mode) => {
    // Если режим уже выбран, снимаем выбор (отменяем фильтрацию)
    if (selectedMode === mode) {
      setSelectedMode(null);
      return;
    }
    setSelectedMode(mode);
    // Если выбранный предмет не совместим с новым режимом, сбрасываем предмет
    if (selectedSubject) {
      const modeGames = games.filter((game) => game.mode === mode);
      const availableSubjects = [...new Set(modeGames.map((game) => game.subject))];
      if (!availableSubjects.includes(selectedSubject)) {
        setSelectedSubject(null);
      }
    }
  };

  const handleModePageOpen = useCallback((modeId) => {
    const modeData = gameModes.find((m) => m.id === modeId);
    if (modeData) {
      setCurrentMode(modeData);
      setCurrentPage('mode');
    }
  }, []);

  const handleBackToMain = useCallback(() => {
    setCurrentPage('main');
    setCurrentMode(null);
  }, []);

  const handleResetFilters = () => {
    setSelectedSubject(null);
    setSelectedMode(null);
  };

  const filteredGames = games.filter((game) => {
    if (selectedSubject && game.subject !== selectedSubject) return false;
    if (selectedMode && game.mode !== selectedMode) return false;
    return true;
  });

  const availableModes = getAvailableModes();
  const availableSubjects = getAvailableSubjects();

  // Слушаем событие смены режима
  useEffect(() => {
    const handleModeChange = (e) => {
      const { modeId, startGame } = e.detail;
      handleModePageOpen(modeId, startGame);
    };
    
    // Слушаем событие перехода на главную
    const handleGoToMain = () => {
      handleBackToMain();
    };
    
    window.addEventListener('modeChange', handleModeChange);
    window.addEventListener('goToMain', handleGoToMain);
    return () => {
      window.removeEventListener('modeChange', handleModeChange);
      window.removeEventListener('goToMain', handleGoToMain);
    };
  }, [handleModePageOpen, handleBackToMain]);

  if (currentPage === 'mode' && currentMode) {
    return (
      <div className="app-shell">
        <div className="main-area">
          <Topbar />
          <ModePage
            modeId={currentMode.id}
            modeLabel={currentMode.label}
            onBack={handleBackToMain}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="main-area">
        <Topbar />
        <div className="content-area">
          <SubjectSelector
            onSubjectSelect={handleSubjectSelect}
            selectedSubject={selectedSubject}
            availableSubjects={availableSubjects}
          />
          <CategoryPills
            modes={availableModes}
            onModeSelect={handleModeSelect}
            selectedMode={selectedMode}
            onModePageOpen={handleModePageOpen}
          />
          <GameGrid
            games={filteredGames}
            onResetFilters={handleResetFilters}
            onModePageOpen={handleModePageOpen}
          />
        </div>
      </div>
    </div>
  );
}

export default App;


