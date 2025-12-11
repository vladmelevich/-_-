import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import GameGrid from '../components/GameGrid';
import { Gift, Zap } from 'lucide-react';

const BonusBuyPage = () => {
  const { t } = useLanguage();

  const bonusBuyGames = [
    { id: 1, title: 'Sugar Rush Bonus Buy', provider: 'Pragmatic Play', tag: 'Bonus Buy', cover: 'sugar', subject: 'ТРПО', mode: 'dice-sum' },
    { id: 2, title: 'Gates of Olympus Bonus', provider: 'Pragmatic Play', tag: 'Bonus Buy', cover: 'zeus', subject: 'КПиЯП', mode: 'blackjack' },
    { id: 3, title: 'Sweet Bonanza Bonus', provider: 'Pragmatic Play', tag: 'Bonus Buy', cover: 'sugar', subject: 'ПСИИП', mode: 'football' },
    { id: 4, title: 'Big Bass Bonus', provider: 'Pragmatic Play', tag: 'Bonus Buy', cover: 'chicken', subject: 'ТРПО', mode: 'dice-american' },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-[1400px] mx-auto w-full px-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center">
          <Gift className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white">{t('bonusBuy')}</h1>
      </div>

      <div className="bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-2xl p-6 border border-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold text-white">{t('bonusBuyInfo')}</h2>
        </div>
        <p className="text-gray-300">
          {t('bonusBuyInfoDesc')}
        </p>
      </div>

      <GameGrid games={bonusBuyGames} onModePageOpen={(id) => console.log('Open game:', id)} />
    </div>
  );
};

export default BonusBuyPage;

