import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { searchGames } from '../utils/gamesData';
import { useLanguage } from '../context/LanguageContext';

const GameSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Поиск игр при изменении запроса
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchResults = searchGames(searchQuery);
    setResults(searchResults);
    setIsOpen(searchResults.length > 0);
    setSelectedIndex(-1);
  }, [searchQuery]);

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Обработка навигации с клавиатуры
  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleGameClick(results[selectedIndex]);
        } else if (results.length > 0) {
          handleGameClick(results[0]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchQuery('');
        break;
      default:
        break;
    }
  };

  // Прокрутка к выбранному элементу
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex, results]);

  const handleGameClick = (game) => {
    if (game.mode) {
      navigate(`/game/${game.mode}`);
    }
    setSearchQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleClear = () => {
    setSearchQuery('');
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const getModeLabel = (mode) => {
    const modeLabels = {
      'dice-sum': 'Dice на сумму',
      'dice-american': 'Dice американский',
      'coinflip': 'Coinflip',
      'blackjack': 'Blackjack',
      'football': 'Football',
      'nvuti': 'Nvuti'
    };
    return modeLabels[mode] || mode;
  };

  return (
    <div className="relative flex-1 max-w-xl" ref={searchRef}>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-500 group-focus-within:text-primary transition-colors" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) {
              setIsOpen(true);
            }
          }}
          className="block w-full pl-11 pr-10 py-3 bg-[#130f1f] border border-white/5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
          placeholder={t('searchGames')}
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-2 flex items-center pr-2 text-gray-400 hover:text-white transition-colors"
            type="button"
            aria-label="Очистить"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <button className="absolute right-2 top-2 bottom-2 bg-white/5 hover:bg-white/10 text-gray-400 px-3 rounded-lg text-xs font-bold transition-colors hidden md:block">
          {t('providers')}
        </button>
      </div>

      {/* Выпадающий список результатов */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-[#130f1f] border border-white/10 rounded-xl shadow-2xl max-h-[400px] overflow-y-auto z-50 backdrop-blur-xl game-search-results">
          <div className="p-2" ref={resultsRef}>
            {results.map((game, index) => (
              <button
                key={game.id}
                onClick={() => handleGameClick(game)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  index === selectedIndex
                    ? 'bg-primary/20 border border-primary/50'
                    : 'hover:bg-white/5 border border-transparent'
                }`}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex-shrink-0 game-card__cover--${game.cover}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-semibold text-sm truncate">{game.title}</h4>
                      {game.tag && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-primary/30 text-primary font-bold uppercase">
                          {game.tag}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{game.provider}</span>
                      {game.mode && (
                        <>
                          <span>•</span>
                          <span>{getModeLabel(game.mode)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Сообщение "Ничего не найдено" */}
      {isOpen && searchQuery.trim() !== '' && results.length === 0 && (
        <div className="absolute top-full mt-2 w-full bg-[#130f1f] border border-white/10 rounded-xl shadow-2xl p-4 z-50 backdrop-blur-xl">
          <p className="text-gray-400 text-sm text-center">Игры не найдены</p>
        </div>
      )}
    </div>
  );
};

export default GameSearch;

