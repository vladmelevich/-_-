import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import GameGrid from '../components/GameGrid';
import { Dna, Users, Play } from 'lucide-react';

const LiveCasinoPage = () => {
  const { t } = useLanguage();

  const liveGames = [
    { id: 1, title: 'Live Blackjack', provider: 'Evolution Gaming', cover: 'hell', subject: 'ТРПО', mode: 'blackjack', players: 124 },
    { id: 2, title: 'Live Roulette', provider: 'Evolution Gaming', cover: 'zeus', subject: 'КПиЯП', mode: 'football', players: 89 },
    { id: 3, title: 'Live Baccarat', provider: 'Pragmatic Play Live', cover: 'astronaut', subject: 'ПСИИП', mode: 'nvuti', players: 156 },
    { id: 4, title: 'Live Poker', provider: 'Evolution Gaming', cover: 'chicken', subject: 'ТРПО', mode: 'dice-american', players: 67 },
    { id: 5, title: 'Live Game Show', provider: 'Evolution Gaming', cover: 'coins', subject: 'КПиЯП', mode: 'blackjack', players: 234 },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-[1400px] mx-auto w-full px-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center">
          <Dna className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white">{t('liveCasino')}</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {liveGames.map((game) => (
          <div
            key={game.id}
            className="bg-card rounded-2xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 group cursor-pointer"
          >
            <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-blue-600/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-primary/30 transition-all">
                  <Play className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                LIVE
              </div>
              <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <Users className="w-3 h-3" />
                {game.players}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-white font-bold mb-1">{game.title}</h3>
              <p className="text-gray-400 text-sm">{game.provider}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveCasinoPage;

