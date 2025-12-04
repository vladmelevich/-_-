import PropTypes from 'prop-types';
function GameCard({ game }) {
  return (
    <article className="game-card">
      <div className={`game-card__cover game-card__cover--${game.cover}`} aria-label={game.title} />
      {game.tag ? <span className="game-card__tag">{game.tag}</span> : null}
      <div className="game-card__info">
        <h3>{game.title}</h3>
        <p>{game.provider}</p>
      </div>
    </article>
  );
}

GameCard.propTypes = {
  game: PropTypes.shape({
    title: PropTypes.string.isRequired,
    provider: PropTypes.string.isRequired,
    tag: PropTypes.string,
    cover: PropTypes.string.isRequired
  }).isRequired
};

export default GameCard;

