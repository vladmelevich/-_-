import { useEffect } from 'react';
import PropTypes from 'prop-types';

function GameResult({ isWinner, onClose }) {
  // Автоматическое закрытие через 5 секунд
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`game-result-notification ${isWinner ? 'game-result-notification--win' : 'game-result-notification--lose'}`}>
      <div className="game-result-notification-content">
        <div className="game-result-notification-glow"></div>
        <div className="game-result-notification-icon-wrapper">
          <div className="game-result-notification-icon">
            {isWinner ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            )}
          </div>
        </div>
        <div className="game-result-notification-text">
          <h3 className="game-result-notification-title">
            {isWinner ? 'Вы победили!' : 'Вы проиграли'}
          </h3>
          <p className="game-result-notification-subtitle">
            {isWinner ? 'Отличная игра!' : 'Попробуйте еще раз'}
          </p>
        </div>
        <button 
          className="game-result-notification-close" 
          type="button" 
          onClick={onClose}
          aria-label="Закрыть"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
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

