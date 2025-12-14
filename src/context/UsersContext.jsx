import { createContext, useContext, useState, useEffect } from 'react';

const UsersContext = createContext();

export const useUsers = () => useContext(UsersContext);

// Инициализация предустановленного админа
const INITIAL_ADMIN = {
  id: 'admin_001',
  username: 'admin',
  role: 'admin',
  credits: 0,
  wins: 0,
  losses: 0,
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=admin`,
  createdAt: Date.now()
};

export const UsersProvider = ({ children }) => {
  // Храним всех пользователей в памяти
  const [users, setUsers] = useState(() => {
    // Загружаем из localStorage при инициализации
    try {
      const stored = localStorage.getItem('all_users');
      let parsed = [];
      
      if (stored) {
        parsed = JSON.parse(stored);
      }
      
      // Миграция: если есть старые данные без ролей, добавляем роль 'user'
      parsed = parsed.map(u => ({
        ...u,
        role: u.role || 'user',
        credits: u.credits !== undefined ? u.credits : (u.balance !== undefined ? u.balance : 0),
        wins: u.wins || 0,
        losses: u.losses || 0
      }));
      
      // Убеждаемся, что админ всегда есть
      const hasAdmin = parsed.some(u => u.id === 'admin_001' || (u.username === 'admin' && u.role === 'admin'));
      if (!hasAdmin) {
        parsed.push(INITIAL_ADMIN);
      } else {
        // Обновляем админа если он есть, но с неправильными данными
        const adminIndex = parsed.findIndex(u => u.id === 'admin_001' || (u.username === 'admin' && u.role === 'admin'));
        if (adminIndex >= 0) {
          parsed[adminIndex] = { ...INITIAL_ADMIN, ...parsed[adminIndex], id: 'admin_001', username: 'admin', role: 'admin' };
        }
      }
      
      return parsed;
    } catch (e) {
      console.error('Failed to load users from localStorage', e);
      return [INITIAL_ADMIN];
    }
  });

  // Синхронизация с localStorage при изменении users
  useEffect(() => {
    try {
      localStorage.setItem('all_users', JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users to localStorage', e);
    }
  }, [users]);

  // Добавление нового пользователя
  const addUser = (userData) => {
    const newUser = {
      ...userData,
      id: userData.id || Date.now().toString(),
      role: userData.role || 'user',
      credits: userData.credits || 0,
      wins: userData.wins || 0,
      losses: userData.losses || 0,
      createdAt: userData.createdAt || Date.now()
    };

    setUsers(prev => {
      // Проверяем, нет ли уже пользователя с таким ID или username
      const existingIndex = prev.findIndex(u => 
        u.id === newUser.id || u.username === newUser.username
      );
      
      if (existingIndex >= 0) {
        // Обновляем существующего пользователя
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], ...newUser };
        return updated;
      } else {
        // Добавляем нового пользователя
        return [...prev, newUser];
      }
    });

    return newUser;
  };

  // Обновление пользователя
  const updateUser = (userId, updates) => {
    setUsers(prev => {
      const index = prev.findIndex(u => u.id === userId);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = { ...updated[index], ...updates };
        return updated;
      }
      return prev;
    });
  };

  // Получение пользователя по ID
  const getUserById = (userId) => {
    return users.find(u => u.id === userId);
  };

  // Получение пользователя по username
  const getUserByUsername = (username) => {
    return users.find(u => u.username === username);
  };

  // Получение всех обычных пользователей (студентов)
  const getStudents = () => {
    return users.filter(u => u.role === 'user');
  };

  // Получение всех админов
  const getAdmins = () => {
    return users.filter(u => u.role === 'admin');
  };

  // Изменение зачетов пользователя
  const updateUserCredits = (userId, amount) => {
    const user = getUserById(userId);
    if (!user) return false;

    const newCredits = Math.max(0, (user.credits || 0) + amount);
    updateUser(userId, { credits: newCredits });
    return true;
  };

  // Удаление пользователя (опционально, для админа)
  const deleteUser = (userId) => {
    // Не позволяем удалить админа
    const user = getUserById(userId);
    if (user && user.role === 'admin') return false;

    setUsers(prev => prev.filter(u => u.id !== userId));
    return true;
  };

  const value = {
    users,
    addUser,
    updateUser,
    getUserById,
    getUserByUsername,
    getStudents,
    getAdmins,
    updateUserCredits,
    deleteUser
  };

  return (
    <UsersContext.Provider value={value}>
      {children}
    </UsersContext.Provider>
  );
};

