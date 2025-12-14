import React, { useState } from 'react';
import { Bell, Wallet, User, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationsContext';
import { Link } from 'react-router-dom';
import GameSearch from '../GameSearch';
import NotificationsDropdown from '../NotificationsDropdown';

const Topbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { unreadCount } = useNotifications();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="h-[70px] sm:h-[80px] px-3 sm:px-4 md:px-6 flex items-center justify-between sticky top-0 bg-background/90 backdrop-blur-xl z-10 border-b border-white/10 shadow-lg shadow-black/20">
      {/* Mobile Menu Button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors mr-2"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <GameSearch />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 ml-2 sm:ml-4 md:ml-6">
        {user ? (
          <>
            <div className="hidden sm:flex bg-gradient-to-r from-[#130f1f] to-[#1a1528] border border-white/10 rounded-xl p-1.5 pr-3 md:pr-4 items-center gap-2 md:gap-3 shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all duration-300">
               <div className="bg-gradient-to-br from-primary/30 to-primary/10 p-1.5 md:p-2 rounded-lg shadow-md shadow-primary/20">
                 <Wallet className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
               </div>
               <div className="flex flex-col">
                 <span className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t('yourBalance')}</span>
                 <span className="text-xs md:text-sm font-bold bg-gradient-to-r from-white to-primary/80 bg-clip-text text-transparent leading-none">{user.credits?.toLocaleString() || 0} зач.</span>
               </div>
            </div>
            
            <Link to="/profile" className="relative p-2 md:p-3 bg-gradient-to-br from-[#130f1f] to-[#1a1528] border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 text-gray-400 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg">
              <User className="w-4 h-4 md:w-5 md:h-5" />
            </Link>
            
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 md:p-3 bg-gradient-to-br from-[#130f1f] to-[#1a1528] border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 text-gray-400 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <Bell className="w-4 h-4 md:w-5 md:h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 md:top-2 md:right-2 w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 rounded-full border-2 border-[#130f1f] animate-pulse shadow-lg shadow-red-500/50"></span>
                )}
              </button>
              <NotificationsDropdown
                isOpen={notificationsOpen}
                onClose={() => setNotificationsOpen(false)}
              />
            </div>
          </>
        ) : (
          <div className="flex gap-2 sm:gap-3">
             <Link to="/login" className="px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold text-xs sm:text-sm transition-all duration-300 shadow-md hover:shadow-lg">
               {t('login')}
             </Link>
             <Link to="/register" className="px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-primary to-primaryHover hover:from-primaryHover hover:to-primary text-white font-semibold text-xs sm:text-sm shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all duration-300 transform hover:scale-105">
               {t('register')}
             </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;

