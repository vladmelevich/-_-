import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Zap, Trophy, Star, TrendingUp } from 'lucide-react';

const PromotionsPage = () => {
  const { t } = useLanguage();

  const promotions = [
    {
      id: 1,
      titleKey: 'newYearJackpot',
      descriptionKey: 'newYearJackpotDesc',
      prize: '4,000,000€',
      participants: '12,543',
      status: 'active',
      icon: Trophy
    },
    {
      id: 2,
      titleKey: 'dropsWins',
      descriptionKey: 'dropsWinsDesc',
      prize: '11,760,000€',
      participants: '8,921',
      status: 'active',
      icon: Zap
    },
    {
      id: 3,
      titleKey: 'coinsExchange',
      descriptionKey: 'coinsExchangeDesc',
      prizeKey: 'noLimit',
      participantsKey: 'allPlayers',
      status: 'active',
      icon: Star
    },
    {
      id: 4,
      titleKey: 'betIncrease',
      descriptionKey: 'betIncreaseDesc',
      prize: '20%',
      prizeKey: 'upTo',
      participantsKey: 'newPlayers',
      status: 'active',
      icon: TrendingUp
    }
  ];

  return (
    <div className="flex flex-col gap-8 max-w-[1400px] mx-auto w-full px-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">{t('promotions')}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {promotions.map((promo) => {
          const Icon = promo.icon;
          return (
            <div
              key={promo.id}
              className="bg-card rounded-2xl p-6 border border-white/5 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <div className="relative">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-white">{t(promo.titleKey)}</h3>
                      {promo.status === 'active' && (
                        <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full font-semibold">
                          {t('activeF')}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">{t(promo.descriptionKey)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">{t('prizePool')}</div>
                    <div className="text-accent font-bold text-xl">
                      {promo.prizeKey ? `${t(promo.prizeKey)} ${promo.prize || ''}` : promo.prize}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-1">{t('participants')}</div>
                    <div className="text-white font-semibold">
                      {promo.participantsKey ? t(promo.participantsKey) : promo.participants}
                    </div>
                  </div>
                </div>
                <button className="w-full mt-4 bg-primary hover:bg-primaryHover text-white py-3 rounded-xl font-semibold transition-all shadow-lg shadow-primary/20">
                  {t('details')}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PromotionsPage;

