import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Gift, Sparkles, Clock, CheckCircle } from 'lucide-react';

const BonusesPage = () => {
  const { t } = useLanguage();

  const bonuses = [
    {
      id: 1,
      titleKey: 'welcomeBonus',
      descriptionKey: 'welcomeBonusDesc',
      amount: '50,000 ₽',
      status: 'available',
      expiresKey: 'days',
      expiresValue: 30,
      icon: Gift
    },
    {
      id: 2,
      titleKey: 'secondWeekBonus',
      descriptionKey: 'secondWeekBonusDesc',
      amount: '25,000 ₽',
      status: 'available',
      expiresKey: 'days',
      expiresValue: 14,
      icon: Sparkles
    },
    {
      id: 3,
      titleKey: 'weeklyCashback',
      descriptionKey: 'weeklyCashbackDesc',
      amount: '10,000 ₽',
      amountKey: 'upTo',
      status: 'active',
      expiresKey: 'active',
      icon: CheckCircle
    },
    {
      id: 4,
      titleKey: 'appInstallBonus',
      descriptionKey: 'appInstallBonusDesc',
      amount: '200 Coins',
      status: 'available',
      expiresKey: 'noLimit',
      icon: Gift
    }
  ];

  return (
    <div className="flex flex-col gap-8 max-w-[1400px] mx-auto w-full px-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">{t('bonuses')}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bonuses.map((bonus) => {
          const Icon = bonus.icon;
          return (
            <div
              key={bonus.id}
              className="bg-card rounded-2xl p-6 border border-white/5 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-white">{t(bonus.titleKey)}</h3>
                    {bonus.status === 'active' && (
                      <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full font-semibold">
                        {t('active')}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{t(bonus.descriptionKey)}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-accent font-bold text-lg">
                        {bonus.amountKey ? `${t(bonus.amountKey)} ${bonus.amount}` : bonus.amount}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {bonus.expiresValue 
                            ? `${bonus.expiresValue} ${t(bonus.expiresKey)}`
                            : t(bonus.expiresKey)
                          }
                        </span>
                      </div>
                    </div>
                    <button className="bg-primary hover:bg-primaryHover text-white px-6 py-2 rounded-xl font-semibold transition-all shadow-lg shadow-primary/20">
                      {t('claim')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BonusesPage;

