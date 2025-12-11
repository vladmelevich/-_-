import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
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
          setUser(JSON.parse(storedUser));
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
  }, []);

  const login = (username, password) => {
    // Имитация входа (в реальности здесь был бы запрос к API)
    // Для демо просто создаем пользователя с начальным балансом
    const newUser = {
      id: Date.now().toString(),
      username,
      balance: 10000, // Начальный баланс
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
    };
    
    setUser(newUser);
    const loginTime = Date.now();
    localStorage.setItem('mell_user', JSON.stringify(newUser));
    localStorage.setItem('mell_login_time', loginTime.toString());
    return true;
  };

  const register = (username, password) => {
    // Для демо регистрация работает так же как вход
    return login(username, password);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mell_user');
    localStorage.removeItem('mell_login_time');
  };

  const updateBalance = (amount) => {
    if (!user) return;
    const updatedUser = { ...user, balance: user.balance + amount };
    setUser(updatedUser);
    localStorage.setItem('mell_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateBalance,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

