import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { LogIn, User } from 'lucide-react';

function AuthWarningModal({ onContinueAsGuest, onLogin }) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Блокируем прокрутку body когда модальное окно открыто
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleLogin = () => {
    onLogin();
    navigate('/login');
  };

  return (
    <div className="game-lobby-overlay" style={{ overflow: 'hidden' }}>
      <div className="game-lobby-modal" style={{ minWidth: 'auto', maxWidth: '500px', padding: '28px', overflow: 'hidden' }}>
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            margin: '0 auto 12px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(141, 92, 255, 0.2) 0%, rgba(255, 193, 7, 0.2) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid rgba(141, 92, 255, 0.3)'
          }}>
            <User style={{ width: '24px', height: '24px', color: '#8d5cff' }} />
          </div>
          <h2 className="game-lobby-title" style={{ fontSize: '20px', marginBottom: '8px' }}>
            Для игры требуется авторизация
          </h2>
          <p className="game-lobby-message" style={{ marginBottom: '0', fontSize: '14px' }}>
            Чтобы начать играть, необходимо войти в систему. Вы можете остаться гостем и просматривать игры, но для участия потребуется авторизация.
          </p>
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          flexDirection: 'row',
          marginTop: '24px'
        }}>
          <button
            onClick={handleLogin}
            style={{
              flex: 1,
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #8d5cff 0%, #6d3fd3 100%)',
              border: 'none',
              borderRadius: '10px',
              fontWeight: '600',
              fontSize: '14px',
              color: '#fff',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(141, 92, 255, 0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(141, 92, 255, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(141, 92, 255, 0.3)';
            }}
          >
            <LogIn style={{ width: '16px', height: '16px' }} />
            Войти в аккаунт
          </button>
          
          <button
            onClick={onContinueAsGuest}
            style={{
              flex: 1,
              padding: '12px 20px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              fontWeight: '600',
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.8)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.color = '#fff';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
              e.target.style.color = 'rgba(255, 255, 255, 0.8)';
            }}
          >
            Остаться гостем
          </button>
        </div>
      </div>
    </div>
  );
}

AuthWarningModal.propTypes = {
  onContinueAsGuest: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired
};

export default AuthWarningModal;

