import { useState, useEffect } from 'react';

function Topbar() {
  const [selectedRole, setSelectedRole] = useState(() => {
    const saved = localStorage.getItem('selectedRole');
    return saved || 'student';
  });

  useEffect(() => {
    localStorage.setItem('selectedRole', selectedRole);
  }, [selectedRole]);

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    // Отправляем кастомное событие для обновления других компонентов
    window.dispatchEvent(new CustomEvent('roleChanged'));
  };

  return (
    <header className="topbar">
      <div className="topbar__left">
        <h1 className="brand-title">Mellstroy</h1>
      </div>
      <div className="topbar__actions">
        <div className="topbar__role-switch">
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
      </div>
    </header>
  );
}

export default Topbar;

