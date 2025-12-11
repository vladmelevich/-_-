import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import GameGrid from '../components/GameGrid';
import { Dice5, Gamepad2 } from 'lucide-react';

const TableGamesPage = () => {
  const { t } = useLanguage();

  const tableGames = [
    { id: 1, title: 'Blackjack Classic', provider: 'Pragmatic Play', cover: 'hell', subject: 'ТРПО', mode: 'blackjack' },
    { id: 2, title: 'European Roulette', provider: 'Pragmatic Play', cover: 'zeus', subject: 'КПиЯП', mode: 'football' },
    { id: 3, title: 'Baccarat', provider: 'Pragmatic Play', cover: 'astronaut', subject: 'ПСИИП', mode: 'nvuti' },
    { id: 4, title: 'Poker Texas Hold\'em', provider: 'Pragmatic Play', cover: 'chicken', subject: 'ТРПО', mode: 'dice-american' },
    { id: 5, title: 'Three Card Poker', provider: 'Pragmatic Play', cover: 'coins', subject: 'КПиЯП', mode: 'blackjack' },
    { id: 6, title: 'Caribbean Stud', provider: 'Pragmatic Play', cover: 'king', subject: 'ПСИИП', mode: 'football' },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-[1400px] mx-auto w-full px-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center">
          <Dice5 className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white">{t('tableGames')}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-card rounded-2xl p-6 border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold">{t('classicGames')}</h3>
            <p className="text-gray-400 text-sm">{t('classicGamesDesc')}</p>
          </div>
        </div>
        <div className="bg-card rounded-2xl p-6 border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center">
            <Dice5 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold">{t('roulette')}</h3>
            <p className="text-gray-400 text-sm">{t('rouletteDesc')}</p>
          </div>
        </div>
      </div>

      <GameGrid games={tableGames} onModePageOpen={(id) => console.log('Open game:', id)} />
    </div>
  );
};

export default TableGamesPage;

