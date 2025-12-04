const navItems = [
  { id: 'home', label: 'Главная', icon: 'home' },
  { id: 'bonus', label: 'Бонусы', badge: 4, icon: 'gift' },
  { id: 'actions', label: 'Акции', icon: 'fire' },
  { id: 'slots', label: 'Слоты', icon: 'slots' },
  { id: 'live', label: 'Live казино', icon: 'live' },
  { id: 'buy', label: 'Bonus buy', icon: 'bonus' },
  { id: 'new', label: 'Новые', icon: 'spark' }
];

const bottomNav = [
  { id: 'rules', label: 'Правила', icon: 'rules' },
  { id: 'support', label: 'Поддержка', icon: 'support' }
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__brand">
          <span className="sidebar__brand-mark">M</span>
          <div className="sidebar__brand-text">
            <span>Mellstroy</span>
            <small>хаха сыграй в казик получи варик</small>
          </div>
        </div>
        <div className="sidebar__mode-switch">
          <button className="mode-button mode-button--active" type="button">
            <span className="icon icon-casino" aria-hidden />
            <span>Казино</span>
          </button>
          <button className="mode-button" type="button">
            <span className="icon icon-sport" aria-hidden />
            <span>Спорт</span>
          </button>
        </div>
      </div>
      <div className="sidebar__profile-card">
        <div className="profile-avatar">?</div>
        <div>
          <div className="profile-title">Войти</div>
          <div className="profile-subtitle">Создай аккаунт за 10 секунд</div>
        </div>
        <button className="profile-toggle">›</button>
      </div>
      <div className="sidebar__online">
        <span className="online-dot" />
        <span>Игроков онлайн</span>
        <strong>2 051</strong>
      </div>
      <nav className="sidebar__nav">
        <div className="nav-section">
          {navItems.map((item) => (
            <a key={item.id} className={`nav-item ${item.id === 'home' ? 'nav-item--active' : ''}`} href="#">
              <span className={`nav-icon icon icon-${item.icon}`} aria-hidden />
              <span>{item.label}</span>
              {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
            </a>
          ))}
        </div>
        <div className="nav-section nav-section--bottom">
          {bottomNav.map((item) => (
            <a key={item.id} className="nav-item" href="#">
              <span className={`nav-icon icon icon-${item.icon}`} aria-hidden />
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;

