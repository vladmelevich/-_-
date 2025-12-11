import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MessageCircle, Mail, Send, HelpCircle, FileText, Clock } from 'lucide-react';

const SupportPage = () => {
  const { t } = useLanguage();
  const [message, setMessage] = useState('');

  const faqItems = [
    {
      questionKey: 'howToDeposit',
      answerKey: 'howToDepositAnswer'
    },
    {
      questionKey: 'howToWithdraw',
      answerKey: 'howToWithdrawAnswer'
    },
    {
      questionKey: 'howToGetBonus',
      answerKey: 'howToGetBonusAnswer'
    },
    {
      questionKey: 'whatAreCoins',
      answerKey: 'whatAreCoinsAnswer'
    }
  ];

  const supportMethods = [
    {
      icon: MessageCircle,
      titleKey: 'onlineChat',
      descriptionKey: 'chatDescription',
      actionKey: 'startChat',
      email: 'support@mellstroy.com',
      available: true
    },
    {
      icon: Mail,
      titleKey: 'emailSupport',
      description: 'support@mellstroy.com',
      actionKey: 'write',
      available: true
    },
    {
      icon: FileText,
      titleKey: 'knowledgeBase',
      descriptionKey: 'kbDescription',
      actionKey: 'open',
      available: true
    }
  ];

  return (
    <div className="flex flex-col gap-8 max-w-[1400px] mx-auto w-full px-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white">{t('support')}</h1>
      </div>

      {/* Support Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {supportMethods.map((method, index) => {
          const Icon = method.icon;
          return (
            <div
              key={index}
              className="bg-card rounded-2xl p-6 border border-white/5 hover:border-primary/50 transition-all"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-bold mb-2">{t(method.titleKey)}</h3>
              <p className="text-gray-400 text-sm mb-4">
                {method.descriptionKey ? t(method.descriptionKey) : method.description}
              </p>
              <button className="w-full bg-primary hover:bg-primaryHover text-white py-2 rounded-xl font-semibold transition-all">
                {t(method.actionKey)}
              </button>
            </div>
          );
        })}
      </div>

      {/* Contact Form */}
      <div className="bg-card rounded-2xl p-6 border border-white/5">
        <h2 className="text-xl font-bold text-white mb-4">{t('sendMessage')}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">{t('yourMessage')}</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('messagePlaceholder')}
              className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-all min-h-[120px]"
            />
          </div>
          <button className="w-full bg-primary hover:bg-primaryHover text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
            <Send className="w-5 h-5" />
            {t('send')}
          </button>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-card rounded-2xl p-6 border border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold text-white">{t('faq')}</h2>
        </div>
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div key={index} className="border-b border-white/5 pb-4 last:border-0">
              <h3 className="text-white font-semibold mb-2">{t(item.questionKey)}</h3>
              <p className="text-gray-400 text-sm">{t(item.answerKey)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Working Hours */}
      <div className="bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-2xl p-6 border border-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-6 h-6 text-primary" />
          <h3 className="text-lg font-bold text-white">{t('supportHours')}</h3>
        </div>
        <p className="text-gray-300">
          {t('supportHoursDesc')}
        </p>
      </div>
    </div>
  );
};

export default SupportPage;

