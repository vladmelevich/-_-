import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { User, Wallet, Settings, LogOut, ArrowLeft, Mail, Calendar, Award, Gift, Zap } from 'lucide-react';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-gray-400">{t('pleaseLogin')}</p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-3 bg-primary hover:bg-primaryHover text-white rounded-xl font-semibold transition-all"
        >
          {t('login')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-bold text-white">{t('profile')}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl p-6 border border-white/5">
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-24 h-24 rounded-2xl bg-gray-800 border-2 border-primary/50"
                />
              </div>
              <h2 className="text-xl font-bold text-white mb-1">{user.username}</h2>
              <p className="text-gray-400 text-sm">ID: {user.id}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                <Wallet className="w-5 h-5 text-accent" />
                <div className="flex-1">
                  <p className="text-xs text-gray-400">{t('balance')}</p>
                  <p className="text-lg font-bold text-white">{user.balance.toLocaleString()} ₽</p>
                </div>
              </div>

              <button
                onClick={() => navigate('/bonuses')}
                className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
              >
                <Award className="w-5 h-5 text-primary" />
                <span className="text-white font-medium">{t('bonuses')}</span>
              </button>

              <button
                onClick={() => navigate('/support')}
                className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-400" />
                <span className="text-white font-medium">{t('support')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Info */}
          <div className="bg-card rounded-2xl p-6 border border-white/5">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              {t('accountInfo')}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">
                  {t('username')}
                </label>
                <div className="text-white font-medium">{user.username}</div>
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">
                  {t('userID')}
                </label>
                <div className="text-white font-medium font-mono">{user.id}</div>
              </div>
              {user.email && (
                <div>
                  <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">
                    {t('email')}
                  </label>
                  <div className="text-white font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-card rounded-2xl p-6 border border-white/5">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              {t('statistics')}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">{t('totalGames')}</p>
                <p className="text-2xl font-bold text-white">{user.totalGames || 0}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">{t('totalWins')}</p>
                <p className="text-2xl font-bold text-accent">{user.totalWins || 0}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">{t('memberSince')}</p>
                <p className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {user.memberSince || t('today')}
                </p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">{t('level')}</p>
                <p className="text-2xl font-bold text-primary">{user.level || 1}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-card rounded-2xl p-6 border border-white/5">
            <h3 className="text-xl font-bold text-white mb-6">{t('actions')}</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/bonuses')}
                className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Gift className="w-5 h-5 text-primary" />
                  <span className="text-white font-medium">{t('viewBonuses')}</span>
                </div>
                <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
              </button>
              <button
                onClick={() => navigate('/promotions')}
                className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-primary" />
                  <span className="text-white font-medium">{t('viewPromotions')}</span>
                </div>
                <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
              </button>
              <button
                onClick={logout}
                className="w-full flex items-center justify-between p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="w-5 h-5 text-red-400" />
                  <span className="text-white font-medium">{t('logout')}</span>
                </div>
                <ArrowLeft className="w-4 h-4 text-red-400 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

