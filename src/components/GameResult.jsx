import PropTypes from 'prop-types';

function GameResult({ isWinner, onClose }) {
  return (
    <div className="game-result-overlay">
      <div className={`game-result-modal ${isWinner ? 'game-result-modal--win' : 'game-result-modal--lose'}`}>
        <h2 className="game-result-title">
          {isWinner ? 'Вы победили!' : 'Вы проиграли'}
        </h2>
        <div className="game-result-icon">
          {isWinner ? '✓' : '✗'}
        </div>
        <button className="game-result-close-button" type="button" onClick={onClose}>
          Закрыть
        </button>
      </div>
    </div>
  );
}

GameResult.propTypes = {
  isWinner: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default GameResult;

