import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import GameGrid from '../components/GameGrid';
import { Crown, Sparkles } from 'lucide-react';

const NewGamesPage = () => {
  const { t } = useLanguage();

  const newGames = [
    { id: 1, title: 'New Game 1', provider: 'Pragmatic Play', tag: 'NEW', cover: 'sugar', subject: 'ТРПО', mode: 'dice-sum' },
    { id: 2, title: 'New Game 2', provider: 'Endorphina', tag: 'NEW', cover: 'hell', subject: 'КПиЯП', mode: 'blackjack' },
    { id: 3, title: 'New Game 3', provider: 'Spribe', tag: 'NEW', cover: 'astronaut', subject: 'ПСИИП', mode: 'nvuti' },
    { id: 4, title: 'New Game 4', provider: 'Evoplay', tag: 'NEW', cover: 'chicken', subject: 'ТРПО', mode: 'dice-american' },
    { id: 5, title: 'New Game 5', provider: '3 Oaks Gaming', tag: 'NEW', cover: 'coins', subject: 'КПиЯП', mode: 'blackjack' },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-[1400px] mx-auto w-full px-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center">
          <Crown className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white">{t('new')}</h1>
      </div>

      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl p-6 border border-yellow-500/20">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-yellow-400" />
          <h2 className="text-xl font-bold text-white">{t('newGamesTitle')}</h2>
        </div>
        <p className="text-gray-300">
          {t('newGamesDesc')}
        </p>
      </div>

      <GameGrid games={newGames} onModePageOpen={(id) => console.log('Open game:', id)} />
    </div>
  );
};

export default NewGamesPage;

