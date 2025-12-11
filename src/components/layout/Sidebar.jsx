import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, Link } from 'react-router-dom';
import { 
  Home, Gift, Zap, Gamepad2, Dice5, MessageCircle, 
  Download, LogIn, UserPlus, Settings, LogOut, Dna, Crown,
  Instagram, Send, Music, ChevronDown, X, Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { t, language, changeLanguage } = useLanguage();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const languages = {
    ru: { code: 'RU', name: 'Русский', nativeName: 'Русский', flag: '🇷🇺' },
    az: { code: 'AZ', name: 'Azerbaijani', nativeName: 'Азербайджанский', flag: '🇦🇿' },
    en: { code: 'EN', name: 'English (World)', nativeName: 'Английский (международный)', flag: '🇬🇧' },
    ky: { code: 'KY', name: 'Кыргызча', nativeName: 'Кыргызский', flag: '🇰🇬' },
    ro: { code: 'RO', name: 'Moldovan', nativeName: 'Молдавский', flag: '🇲🇩' },
    be: { code: 'BY', name: 'Беларуская', nativeName: 'Белорусский', flag: '🇧🇾' },
    uk: { code: 'UA', name: 'Українська', nativeName: 'Украинский', flag: '🇺🇦' }
  };

  // Безопасное получение текущего языка
  const currentLanguage = (language && languages[language]) ? languages[language] : languages.ru;

  // Закрытие меню при клике вне его и обработка изменения размера окна
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowLanguageMenu(false);
      }
    };

    const handleResize = () => {
      if (showLanguageMenu && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const menuWidth = 320;
        const viewportWidth = window.innerWidth;
        
        const spaceRight = viewportWidth - rect.right;
        const spaceLeft = rect.left;
        
        let left, top;
        
        if (spaceRight >= menuWidth + 8) {
          left = rect.right + 8;
        } else if (spaceLeft >= menuWidth + 8) {
          left = rect.left - menuWidth - 8;
        } else {
          left = Math.max(8, (viewportWidth - menuWidth) / 2);
        }
        
        const menuHeight = 400;
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        
        // Сначала пытаемся разместить сверху (выше кнопки)
        if (spaceAbove >= menuHeight) {
          top = rect.top - menuHeight - 8;
        } else if (spaceBelow >= menuHeight) {
          top = rect.bottom + 8;
        } else {
          top = Math.max(8, (viewportHeight - menuHeight) / 2);
        }
        
        setMenuPosition({ top, left });
      }
    };

    if (showLanguageMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleResize);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [showLanguageMenu]);

  const NavItem = ({ to, icon: Icon, label, badge }) => (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
          isActive 
            ? 'bg-gradient-to-r from-primary/20 to-transparent text-white border-l-2 border-primary' 
            : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`
      }
    >
      <Icon className="w-5 h-5 group-hover:text-primary transition-colors" />
      <span className="font-medium text-sm flex-1">{label}</span>
      {badge && (
        <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
          {badge}
        </span>
      )}
    </NavLink>
  );

  return (
    <aside className="w-[280px] bg-sidebar flex-shrink-0 flex flex-col h-screen sticky top-0 border-r border-white/5 overflow-y-auto custom-scrollbar z-30">
      {/* Brand */}
      <Link to="/" className="p-6 flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="font-bold text-xl text-white">M</span>
        </div>
        <div>
          <h1 className="text-white font-bold text-lg tracking-wide">MCB</h1>
          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">MCB Royale Casino</span>
        </div>
      </Link>

      {/* Auth Actions (if not logged in) */}
      {!user && (
        <div className="px-4 mb-6">
          <div className="grid grid-cols-2 gap-2">
            <NavLink to="/login" className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl transition-all text-sm font-semibold">
              <LogIn className="w-4 h-4" />
              {t('login')}
            </NavLink>
            <NavLink to="/register" className="flex items-center justify-center gap-2 bg-primary hover:bg-primaryHover text-white py-3 rounded-xl transition-all shadow-lg shadow-primary/20 text-sm font-semibold">
              <UserPlus className="w-4 h-4" />
              {t('register')}
            </NavLink>
          </div>
        </div>
      )}

      {/* User Mini Profile (if logged in) */}
      {user && (
        <div className="px-4 mb-6">
          <Link to="/profile" className="bg-card p-3 rounded-xl border border-white/5 flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer">
            <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-lg bg-gray-800" />
            <div className="flex-1 min-w-0">
              <div className="text-white font-bold truncate">{user.username}</div>
              <div className="text-accent text-sm font-mono">{user.balance.toLocaleString()} ₽</div>
            </div>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                logout();
              }} 
              className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </Link>
        </div>
      )}

      {/* Casino/Sport Toggle */}
      <div className="px-4 mb-6">
        <div className="bg-black/20 p-1 rounded-xl flex">
          <button className="flex-1 py-2 rounded-lg bg-gradient-to-r from-primary to-primaryHover text-white text-sm font-bold shadow-lg">
            {t('casino')}
          </button>
          <button className="flex-1 py-2 rounded-lg text-gray-400 hover:text-white text-sm font-bold transition-colors">
            {t('sport')}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 space-y-1">
        <NavItem to="/" icon={Home} label={t('home')} />
        <NavItem to="/bonuses" icon={Gift} label={t('bonuses')} badge="4" />
        <NavItem to="/promotions" icon={Zap} label={t('promotions')} />
        
        <div className="my-4 border-t border-white/5 mx-2"></div>
        
        <NavItem to="/lobby" icon={Gamepad2} label={t('slots')} />
        <NavItem to="/live" icon={Dna} label={t('liveCasino')} />
        <NavItem to="/bonus-buy" icon={Gift} label={t('bonusBuy')} />
        <NavItem to="/new" icon={Crown} label={t('new')} />
        <NavItem to="/table" icon={Dice5} label={t('tableGames')} />
      </nav>

      {/* Footer Links */}
      <div className="p-4 mt-auto border-t border-white/5 space-y-2">
        <NavLink to="/support" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{t('support')}</span>
        </NavLink>
        
        <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 p-4 rounded-xl border border-primary/20 mt-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Download className="w-4 h-4 text-white" />
            </div>
            <div className="text-xs font-semibold text-white">
              {t('installApp')}
            </div>
          </div>
          <div className="text-[10px] text-gray-400">{t('installAppBonus')}</div>
        </div>
        
        <div className="flex items-center justify-between px-2 pt-4">
          <div className="flex gap-2">
             <a 
               href="https://www.instagram.com/mcb.by/" 
               target="_blank" 
               rel="noopener noreferrer"
               className="w-6 h-6 bg-white/10 rounded hover:bg-primary/50 cursor-pointer flex items-center justify-center transition-colors"
               aria-label="Instagram"
             >
               <Instagram className="w-4 h-4 text-white" />
             </a>
             <a 
               href="https://t.me/mcbbyy" 
               target="_blank" 
               rel="noopener noreferrer"
               className="w-6 h-6 bg-white/10 rounded hover:bg-primary/50 cursor-pointer flex items-center justify-center transition-colors"
               aria-label="Telegram"
             >
               <Send className="w-4 h-4 text-white" />
             </a>
             <a 
               href="https://www.tiktok.com/@mcb.by" 
               target="_blank" 
               rel="noopener noreferrer"
               className="w-6 h-6 bg-white/10 rounded hover:bg-primary/50 cursor-pointer flex items-center justify-center transition-colors"
               aria-label="TikTok"
             >
               <Music className="w-4 h-4 text-white" />
             </a>
          </div>
          <div className="relative" ref={menuRef}>
            <button
              ref={buttonRef}
              onClick={() => {
                if (buttonRef.current) {
                  const rect = buttonRef.current.getBoundingClientRect();
                  const menuWidth = 320;
                  const viewportWidth = window.innerWidth;
                  
                  const spaceRight = viewportWidth - rect.right;
                  const spaceLeft = rect.left;
                  
                  let left, top;
                  
                  if (spaceRight >= menuWidth + 8) {
                    left = rect.right + 8;
                  } else if (spaceLeft >= menuWidth + 8) {
                    left = rect.left - menuWidth - 8;
                  } else {
                    left = Math.max(8, (viewportWidth - menuWidth) / 2);
                  }
                  
                  const menuHeight = 400;
                  const viewportHeight = window.innerHeight;
                  const spaceBelow = viewportHeight - rect.bottom;
                  const spaceAbove = rect.top;
                  
                  if (spaceAbove >= menuHeight) {
                    top = rect.top - menuHeight - 8;
                  } else if (spaceBelow >= menuHeight) {
                    top = rect.bottom + 8;
                  } else {
                    top = Math.max(8, (viewportHeight - menuHeight) / 2);
                  }
                  
                  setMenuPosition({ top, left });
                }
                setShowLanguageMenu(!showLanguageMenu);
              }}
              className={`flex items-center gap-2 text-xs font-bold transition-all duration-200 px-3 py-2 rounded-lg group
                ${showLanguageMenu 
                  ? 'bg-primary/20 text-white border border-primary/50' 
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-transparent'
                }`}
            >
              <span className="text-base">{currentLanguage.flag}</span>
              <span className="font-semibold">{currentLanguage.code}</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showLanguageMenu ? 'rotate-180' : ''}`} />
            </button>
            
            {showLanguageMenu && currentLanguage && createPortal(
              <>
                <div 
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm cursor-pointer" 
                  style={{ zIndex: 999999 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowLanguageMenu(false);
                  }}
                />
                <div 
                  className="fixed bg-white rounded-2xl shadow-2xl border border-gray-200 w-[320px] max-h-[90vh] overflow-y-auto
                            max-md:left-1/2 max-md:top-1/2 max-md:-translate-x-1/2 max-md:-translate-y-1/2 max-md:w-[calc(100vw-2rem)]"
                  style={{
                    zIndex: 1000000,
                    pointerEvents: 'auto',
                    ...(window.innerWidth >= 768 ? {
                      top: `${Math.max(8, Math.min(menuPosition.top, window.innerHeight - 400 - 8))}px`,
                      left: `${Math.max(8, Math.min(menuPosition.left, window.innerWidth - 320 - 8))}px`,
                    } : {})
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                        <span className="text-white text-sm">🌐</span>
                      </div>
                      <h3 className="text-base font-bold text-gray-900">{t('languages')}</h3>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowLanguageMenu(false);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors group cursor-pointer active:scale-95"
                    >
                      <X className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </button>
                  </div>

                  {/* Recommended Section */}
                  <div className="px-4 py-3">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{t('recommended')}</h4>
                    <button
                      type="button"
                      onClick={(e) => { 
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Changing language to: ru');
                        changeLanguage('ru'); 
                        setShowLanguageMenu(false); 
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer select-none ${
                        language === 'ru' 
                          ? 'bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/30' 
                          : 'hover:bg-gray-50 border border-transparent hover:shadow-sm active:scale-[0.98]'
                      }`}
                    >
                      <span className="text-2xl">{languages.ru.flag}</span>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-gray-900 text-sm">{languages.ru.name}</div>
                        <div className="text-xs text-gray-500">{languages.ru.nativeName}</div>
                      </div>
                      {language === 'ru' && (
                        <div className="w-6 h-6 bg-gradient-to-r from-primary to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </button>
                  </div>

                  <div className="h-px bg-gray-100 mx-4"></div>

                  {/* All Languages Section */}
                  <div className="px-4 py-3 pb-4">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{t('allLanguages')}</h4>
                    <div className="space-y-1">
                      {Object.entries(languages).filter(([key]) => key !== 'ru').map(([langKey, langData]) => (
                        <button
                          type="button"
                          key={langKey}
                          onClick={(e) => { 
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Changing language to:', langKey);
                            changeLanguage(langKey); 
                            setShowLanguageMenu(false); 
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer select-none ${
                            language === langKey 
                              ? 'bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/30' 
                              : 'hover:bg-gray-50 border border-transparent hover:shadow-sm active:scale-[0.98]'
                          }`}
                        >
                          <span className="text-xl">{langData.flag}</span>
                          <div className="flex-1 text-left">
                            <div className="font-medium text-gray-900 text-sm">{langData.name}</div>
                            <div className="text-xs text-gray-500">{langData.nativeName}</div>
                          </div>
                          {language === langKey && (
                            <div className="w-5 h-5 bg-gradient-to-r from-primary to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>,
              document.body
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

