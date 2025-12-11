import PropTypes from 'prop-types';
import GameCard from './GameCard.jsx';
import { useLanguage } from '../context/LanguageContext';

function GameGrid({ games, onResetFilters, onModePageOpen }) {
  const { t } = useLanguage();
  
  const handleShowAll = () => {
    if (onResetFilters) {
      onResetFilters();
    }
  };

  return (
    <section className="game-grid">
      <div className="section-header">
        <h2>{t('popular')}</h2>
        <button className="button button--ghost" type="button" onClick={handleShowAll}>
          {t('allGames')} ›
        </button>
      </div>
      <div className="game-grid__inner">
        {games.map((game) => (
          <GameCard key={game.id} game={game} onModeClick={onModePageOpen} />
        ))}
      </div>
    </section>
  );
}

GameGrid.propTypes = {
  games: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      provider: PropTypes.string.isRequired,
      tag: PropTypes.string,
      cover: PropTypes.string.isRequired,
      mode: PropTypes.string
    })
  ).isRequired,
  onResetFilters: PropTypes.func,
  onModePageOpen: PropTypes.func
};

export default GameGrid;

