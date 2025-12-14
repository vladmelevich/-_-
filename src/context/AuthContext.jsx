import { createContext, useContext, useState, useEffect } from 'react';
import { useUsers } from './UsersContext';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { addUser, updateUser, getUserByUsername } = useUsers();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Проверка истечения сессии (24 часа)
  const checkSessionExpiry = (loginTime) => {
    const now = Date.now();
    const sessionDuration = 24 * 60 * 60 * 1000; // 24 часа в миллисекундах
    return (now - loginTime) < sessionDuration;
  };

  // Загрузка пользователя из localStorage при старте
  useEffect(() => {
    const storedUser = localStorage.getItem('mell_user');
    const storedLoginTime = localStorage.getItem('mell_login_time');
    
    if (storedUser && storedLoginTime) {
      try {
        const loginTime = parseInt(storedLoginTime, 10);
        if (checkSessionExpiry(loginTime)) {
          const parsedUser = JSON.parse(storedUser);
          // Миграция: если есть старое поле balance, конвертируем в credits
          if (parsedUser.balance !== undefined && parsedUser.credits === undefined) {
            parsedUser.credits = parsedUser.balance;
            delete parsedUser.balance;
            localStorage.setItem('mell_user', JSON.stringify(parsedUser));
          }
          // Убеждаемся, что credits существует
          if (parsedUser.credits === undefined) {
            parsedUser.credits = 0;
          }
          // Убеждаемся, что статистика существует
          if (parsedUser.wins === undefined) {
            parsedUser.wins = 0;
          }
          if (parsedUser.losses === undefined) {
            parsedUser.losses = 0;
          }
          // Убеждаемся, что роль существует
          if (!parsedUser.role) {
            parsedUser.role = 'user';
          }
          
          // Синхронизируем с UsersContext
          const existingUser = getUserByUsername(parsedUser.username);
          if (existingUser) {
            // Используем актуальные данные из UsersContext
            setUser(existingUser);
            localStorage.setItem('mell_user', JSON.stringify(existingUser));
          } else {
            // Добавляем пользователя в систему если его нет
            addUser(parsedUser);
            setUser(parsedUser);
          }
        } else {
          // Сессия истекла
          localStorage.removeItem('mell_user');
          localStorage.removeItem('mell_login_time');
        }
      } catch (e) {
        console.error("Failed to parse user data", e);
        localStorage.removeItem('mell_user');
        localStorage.removeItem('mell_login_time');
      }
    }
    setLoading(false);
  }, [getUserByUsername, addUser]);

  const login = (username, password) => {
    // Проверка предустановленного админа
    if (username === 'admin' && password === 'admin') {
      const adminUser = getUserByUsername('admin') || addUser({
        id: 'admin_001',
        username: 'admin',
        role: 'admin',
        credits: 0,
        wins: 0,
        losses: 0,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=admin`
      });
      
      setUser(adminUser);
      const loginTime = Date.now();
      localStorage.setItem('mell_user', JSON.stringify(adminUser));
      localStorage.setItem('mell_login_time', loginTime.toString());
      return true;
    }

    // Проверяем существующего пользователя
    let existingUser = getUserByUsername(username);
    
    if (!existingUser) {
      // Создаем нового пользователя
      existingUser = addUser({
        id: Date.now().toString(),
        username,
        role: 'user',
        credits: 0,
        wins: 0,
        losses: 0,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
      });
    }
    
    setUser(existingUser);
    const loginTime = Date.now();
    localStorage.setItem('mell_user', JSON.stringify(existingUser));
    localStorage.setItem('mell_login_time', loginTime.toString());
    return true;
  };

  const register = (username, password) => {
    // Проверяем, не существует ли уже пользователь с таким username
    const existingUser = getUserByUsername(username);
    if (existingUser) {
      // Если пользователь существует, просто входим
      return login(username, password);
    }

    // Регистрация создает только обычных пользователей (не админов)
    const newUser = addUser({
      id: Date.now().toString(),
      username,
      role: 'user',
      credits: 0,
      wins: 0,
      losses: 0,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
    });
    
    console.log('Registered new user:', newUser); // Отладка
    
    setUser(newUser);
    const loginTime = Date.now();
    localStorage.setItem('mell_user', JSON.stringify(newUser));
    localStorage.setItem('mell_login_time', loginTime.toString());
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mell_user');
    localStorage.removeItem('mell_login_time');
  };

  const updateCredits = (amount) => {
    if (!user) return;
    const newCredits = Math.max(0, (user.credits || 0) + amount);
    updateUser(user.id, { credits: newCredits });
    const updatedUser = { ...user, credits: newCredits };
    setUser(updatedUser);
    localStorage.setItem('mell_user', JSON.stringify(updatedUser));
  };

  const updateGameResult = (isWinner) => {
    if (!user) return;
    
    const updates = {};
    if (isWinner) {
      // Победа: +1 зачет
      updates.credits = (user.credits || 0) + 1;
      updates.wins = (user.wins || 0) + 1;
    } else {
      // Поражение: -1 зачет (но не меньше 0)
      updates.credits = Math.max(0, (user.credits || 0) - 1);
      updates.losses = (user.losses || 0) + 1;
    }
    
    // Обновляем в системе пользователей
    updateUser(user.id, updates);
    
    // Обновляем текущего пользователя
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('mell_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateCredits,
    updateGameResult,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

