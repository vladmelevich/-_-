import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import GameGrid from '../components/GameGrid';
import { Gamepad2 } from 'lucide-react';

const LobbyPage = () => {
  const { t } = useLanguage();

  // Пример игр для слотов
  const slotGames = [
    { id: 1, title: 'Sugar Rush', provider: 'Pragmatic Play', tag: 'Drops & Wins', cover: 'sugar', subject: 'ТРПО', mode: 'dice-sum' },
    { id: 2, title: 'Gates of Olympus', provider: 'Pragmatic Play', cover: 'zeus', subject: 'КПиЯП', mode: 'blackjack' },
    { id: 3, title: 'Sweet Bonanza', provider: 'Pragmatic Play', cover: 'sugar', subject: 'ПСИИП', mode: 'football' },
    { id: 4, title: 'Big Bass Bonanza', provider: 'Pragmatic Play', tag: 'Bonus Game', cover: 'chicken', subject: 'ТРПО', mode: 'dice-american' },
    { id: 5, title: 'The Dog House', provider: 'Pragmatic Play', cover: 'dog', subject: 'КПиЯП', mode: 'blackjack' },
    { id: 6, title: 'Wild West Gold', provider: 'Pragmatic Play', cover: 'king', subject: 'ПСИИП', mode: 'football' },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-[1400px] mx-auto w-full px-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center">
          <Gamepad2 className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white">{t('slots')}</h1>
      </div>

      <GameGrid games={slotGames} onModePageOpen={(id) => console.log('Open game:', id)} />
    </div>
  );
};

export default LobbyPage;

