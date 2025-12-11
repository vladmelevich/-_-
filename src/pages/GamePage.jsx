import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ModePage from '../components/ModePage';

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
  const [currentMode, setCurrentMode] = useState(null);

  useEffect(() => {
    const modeData = gameModes.find((m) => m.id === id);
    if (modeData) {
      setCurrentMode(modeData);
    } else {
      // Redirect if game not found
      navigate('/');
    }
  }, [id, navigate]);

  if (!currentMode) return null;

  return (
    <div className="max-w-[1400px] mx-auto w-full">
      <ModePage
        modeId={currentMode.id}
        modeLabel={currentMode.label}
        onBack={() => navigate('/')}
      />
    </div>
  );
};

export default GamePage;

