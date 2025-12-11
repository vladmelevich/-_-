import React from 'react';
import { Bell, Wallet, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';
import GameSearch from '../GameSearch';

const Topbar = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <header className="h-[80px] px-6 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-white/5">
      {/* Search Bar */}
      <GameSearch />

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-6">
        {user ? (
          <>
            <div className="bg-[#130f1f] border border-white/5 rounded-xl p-1.5 pr-4 flex items-center gap-3">
               <div className="bg-primary/20 p-2 rounded-lg">
                 <Wallet className="w-4 h-4 text-primary" />
               </div>
               <div className="flex flex-col">
                 <span className="text-[10px] text-gray-400 font-bold uppercase">{t('yourBalance')}</span>
                 <span className="text-sm font-bold text-white leading-none">{user.balance.toLocaleString()} ₽</span>
               </div>
               <button className="ml-2 bg-accent hover:bg-green-400 text-black text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                 {t('topUp')}
               </button>
            </div>
            
            <Link to="/profile" className="relative p-3 bg-[#130f1f] rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
              <User className="w-5 h-5" />
            </Link>
            
            <button className="relative p-3 bg-[#130f1f] rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#130f1f]"></span>
            </button>
          </>
        ) : (
          <div className="flex gap-3">
             <Link to="/login" className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition-all">
               {t('login')}
             </Link>
             <Link to="/register" className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primaryHover text-white font-semibold text-sm shadow-lg shadow-primary/25 transition-all">
               {t('register')}
             </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;

