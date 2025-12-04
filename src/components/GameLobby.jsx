import PropTypes from 'prop-types';

function GameLobby({ onCancel, isBotGame }) {
  return (
    <div className="game-lobby-overlay">
      <div className="game-lobby-modal">
        <h2 className="game-lobby-title">Ожидание игроков</h2>
        <div className="game-lobby-spinner">
          <div className="spinner"></div>
        </div>
        <p className="game-lobby-message">
          {isBotGame 
            ? 'Игра с ботом началась. Ожидаем подключения реального игрока...' 
            : 'Ожидаем подключения соперника...'}
        </p>
        <button className="game-lobby-cancel-button" type="button" onClick={onCancel}>
          Отменить
        </button>
      </div>
    </div>
  );
}

GameLobby.propTypes = {
  onCancel: PropTypes.func.isRequired,
  isBotGame: PropTypes.bool
};

export default GameLobby;

