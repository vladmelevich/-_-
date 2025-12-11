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
                  const menuWidth = 320; // ширина модального окна
                  const viewportWidth = window.innerWidth;
                  
                  // Проверяем, поместится ли модальное окно справа
                  const spaceRight = viewportWidth - rect.right;
                  const spaceLeft = rect.left;
                  
                  let left, top;
                  
                  if (spaceRight >= menuWidth + 8) {
                    // Достаточно места справа
                    left = rect.right + 8;
                  } else if (spaceLeft >= menuWidth + 8) {
                    // Размещаем слева от кнопки
                    left = rect.left - menuWidth - 8;
                  } else {
                    // Центрируем по горизонтали если не хватает места
                    left = Math.max(8, (viewportWidth - menuWidth) / 2);
                  }
                  
                  // Проверяем вертикальное позиционирование (приоритет - сверху)
                  const menuHeight = 400; // примерная высота модального окна
                  const viewportHeight = window.innerHeight;
                  const spaceBelow = viewportHeight - rect.bottom;
                  const spaceAbove = rect.top;
                  
                  // Сначала пытаемся разместить сверху (выше кнопки)
                  if (spaceAbove >= menuHeight) {
                    top = rect.top - menuHeight - 8;
                  } else if (spaceBelow >= menuHeight) {
                    top = rect.bottom + 8;
                  } else {
                    // Центрируем по вертикали если не хватает места
                    top = Math.max(8, (viewportHeight - menuHeight) / 2);
                  }
                  
                  setMenuPosition({ top, left });
                }
                setShowLanguageMenu(!showLanguageMenu);
              }}
              className="flex items-center gap-1 text-xs text-gray-400 font-bold hover:text-white transition-colors px-2 py-1 rounded"
            >
              <span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[10px]">
                {currentLanguage.code}
              </span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showLanguageMenu ? 'rotate-180' : ''}`} />
            </button>
            
            {showLanguageMenu && currentLanguage && createPortal(
              <>
                <div 
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm" 
                  style={{ zIndex: 999999 }}
                  onClick={() => setShowLanguageMenu(false)}
                />
                <div 
                  className="fixed bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 w-[320px] max-h-[90vh] overflow-y-auto
                            max-md:left-1/2 max-md:top-1/2 max-md:-translate-x-1/2 max-md:-translate-y-1/2 max-md:w-[calc(100vw-2rem)]"
                  style={{
                    zIndex: 1000000,
                    ...(window.innerWidth >= 768 ? {
                      top: `${Math.max(8, Math.min(menuPosition.top, window.innerHeight - 400 - 8))}px`,
                      left: `${Math.max(8, Math.min(menuPosition.left, window.innerWidth - 320 - 8))}px`,
                    } : {})
                  }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <h3 className="text-base font-semibold text-gray-900">{t('languages')}</h3>
                    <button
                      onClick={() => setShowLanguageMenu(false)}
                      className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  {/* Recommended Section */}
                  <div className="px-4 py-2">
                    <h4 className="text-xs font-medium text-gray-500 mb-2">{t('recommended')}</h4>
                    <button
                      onClick={() => { changeLanguage('ru'); setShowLanguageMenu(false); }}
                      className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-all ${
                        language === 'ru' 
                          ? 'bg-blue-50' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                        <div className="w-full h-full bg-gradient-to-b from-white via-blue-500 to-red-500"></div>
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-gray-900 text-sm">{languages.ru.name}</div>
                        <div className="text-xs text-gray-500">{languages.ru.nativeName}</div>
                      </div>
                      {language === 'ru' && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  </div>

                  {/* All Languages Section */}
                  <div className="px-4 py-2">
                    <h4 className="text-xs font-medium text-gray-500 mb-2">{t('allLanguages')}</h4>
                    <div className="space-y-1">
                      {/* Azerbaijani */}
                      <button
                        onClick={() => { changeLanguage('az'); setShowLanguageMenu(false); }}
                        className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-all ${
                          language === 'az' 
                            ? 'bg-blue-50' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                          <div className="w-full h-full bg-gradient-to-b from-blue-500 via-red-500 to-green-500"></div>
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium text-gray-900 text-sm">Azerbaijani</div>
                          <div className="text-xs text-gray-500">Азербайджанский</div>
                        </div>
                        {language === 'az' && (
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>

                      {/* English */}
                      <button
                        onClick={() => { changeLanguage('en'); setShowLanguageMenu(false); }}
                        className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-all ${
                          language === 'en' 
                            ? 'bg-blue-50' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                          <div className="w-full h-full bg-gradient-to-br from-blue-600 via-white to-red-600 relative">
                            <div className="absolute inset-0 bg-blue-600"></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white to-transparent"></div>
                            <div className="absolute inset-0 bg-gradient-to-tl from-red-600 via-transparent to-transparent"></div>
                          </div>
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium text-gray-900 text-sm">English (World)</div>
                          <div className="text-xs text-gray-500">Английский (международный)</div>
                        </div>
                        {language === 'en' && (
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>

                      {/* Kyrgyz */}
                      <button
                        onClick={() => { changeLanguage('ky'); setShowLanguageMenu(false); }}
                        className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-all ${
                          language === 'ky' 
                            ? 'bg-blue-50' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                          <div className="w-full h-full bg-red-500"></div>
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium text-gray-900 text-sm">Кыргызча</div>
                          <div className="text-xs text-gray-500">Кыргызский</div>
                        </div>
                        {language === 'ky' && (
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>

                      {/* Moldovan */}
                      <button
                        onClick={() => { changeLanguage('ro'); setShowLanguageMenu(false); }}
                        className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-all ${
                          language === 'ro' 
                            ? 'bg-blue-50' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                          <div className="w-full h-full bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500"></div>
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium text-gray-900 text-sm">Moldovan</div>
                          <div className="text-xs text-gray-500">Молдавский</div>
                        </div>
                        {language === 'ro' && (
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>

                      {/* Belarusian */}
                      <button
                        onClick={() => { changeLanguage('be'); setShowLanguageMenu(false); }}
                        className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-all ${
                          language === 'be' 
                            ? 'bg-blue-50' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                          <div className="w-full h-full bg-gradient-to-b from-red-500 via-green-500 to-red-500"></div>
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium text-gray-900 text-sm">Беларуская</div>
                          <div className="text-xs text-gray-500">Белорусский</div>
                        </div>
                        {language === 'be' && (
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>

                      {/* Ukrainian */}
                      <button
                        onClick={() => { changeLanguage('uk'); setShowLanguageMenu(false); }}
                        className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-all ${
                          language === 'uk' 
                            ? 'bg-blue-50' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                          <div className="w-full h-full bg-gradient-to-b from-blue-500 to-yellow-400"></div>
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium text-gray-900 text-sm">Українська</div>
                          <div className="text-xs text-gray-500">Украинский</div>
                        </div>
                        {language === 'uk' && (
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
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

