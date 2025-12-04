import { useState } from 'react';

const navItems = [
  { id: 'home', label: 'Главная', icon: 'home' }
];

const bottomNav = [
  { id: 'support', label: 'Поддержка', icon: 'support' }
];

function Sidebar() {
  const [selectedRole, setSelectedRole] = useState('student');

  const handleRoleChange = (role) => {
    setSelectedRole(role);
  };

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
      </div>
      <div className="sidebar__role-switch">
        <button
          className={`role-button ${selectedRole === 'student' ? 'role-button--active' : ''}`}
          type="button"
          onClick={() => handleRoleChange('student')}
        >
          <span>Ученик</span>
        </button>
        <button
          className={`role-button ${selectedRole === 'teacher' ? 'role-button--active' : ''}`}
          type="button"
          onClick={() => handleRoleChange('teacher')}
        >
          <span>Преподаватель</span>
        </button>
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

