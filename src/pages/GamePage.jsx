import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ModePage from '../components/ModePage';
import AuthWarningModal from '../components/AuthWarningModal';
import { useAuth } from '../context/AuthContext';

const gameModes = [
  { id: 'dice-sum', label: 'Dice на сумму', icon: 'grid' },
  { id: 'dice-american', label: 'Dice американский', icon: 'grid' },
  { id: 'coinflip', label: 'Coinflip', icon: 'grid' },
  { id: 'blackjack', label: 'Blackjack', icon: 'cards' },
  { id: 'football', label: 'Football', icon: 'zap' },
  { id: 'nvuti', label: 'Nvuti', icon: 'star' }
];

const GamePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [currentMode, setCurrentMode] = useState(null);
  const [showAuthWarning, setShowAuthWarning] = useState(false);

  useEffect(() => {
    const modeData = gameModes.find((m) => m.id === id);
    if (modeData) {
      setCurrentMode(modeData);
    } else {
      // Redirect if game not found
      navigate('/');
      return;
    }

    // Если пользователь авторизовался, скрываем предупреждение
    if (user) {
      setShowAuthWarning(false);
    } else if (!loading && !user) {
      // Показываем предупреждение если пользователь не авторизован
      setShowAuthWarning(true);
    }
  }, [id, navigate, user, loading]);

  const handleContinueAsGuest = () => {
    setShowAuthWarning(false);
    navigate('/');
  };

  const handleLogin = () => {
    setShowAuthWarning(false);
    // Редирект произойдет в компоненте AuthWarningModal
  };

  // Показываем загрузку пока проверяем авторизацию
  if (loading) return null;
  
  if (!currentMode) return null;

  return (
    <div className="max-w-[1400px] mx-auto w-full">
      {showAuthWarning && (
        <AuthWarningModal
          onContinueAsGuest={handleContinueAsGuest}
          onLogin={handleLogin}
        />
      )}
      {!showAuthWarning && (
        <ModePage
          modeId={currentMode.id}
          modeLabel={currentMode.label}
          onBack={() => navigate('/')}
        />
      )}
    </div>
  );
};

export default GamePage;

