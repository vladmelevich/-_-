import PropTypes from 'prop-types';

function GameCard({ game, onModeClick }) {
  const handleClick = () => {
    if (onModeClick && game.mode) {
      onModeClick(game.mode);
    }
  };

  return (
    <article className="game-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className={`game-card__cover game-card__cover--${game.cover}`} aria-label={game.title} />
      {game.tag ? <span className="game-card__tag">{game.tag}</span> : null}
      <div className="game-card__info">
        <h3>{game.mode ? game.mode.charAt(0).toUpperCase() + game.mode.slice(1) : game.title}</h3>
        <p>{game.subject || game.provider}</p>
      </div>
    </article>
  );
}

GameCard.propTypes = {
  game: PropTypes.shape({
    title: PropTypes.string.isRequired,
    provider: PropTypes.string.isRequired,
    tag: PropTypes.string,
    cover: PropTypes.string.isRequired,
    mode: PropTypes.string
  }).isRequired,
  onModeClick: PropTypes.func
};

export default GameCard;

