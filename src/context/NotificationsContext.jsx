import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const NotificationsContext = createContext();

export const useNotifications = () => useContext(NotificationsContext);

export const NotificationsProvider = ({ children }) => {
  // Счетчик для гарантии уникальности ID
  const counterRef = useRef(0);
  
  const [notifications, setNotifications] = useState(() => {
    const stored = localStorage.getItem('mell_notifications');
    const parsed = stored ? JSON.parse(stored) : [];
    // Убеждаемся, что все уведомления имеют уникальные ID
    const seenIds = new Set();
    const uniqueNotifications = parsed.map((notif, index) => {
      let id = notif.id;
      // Если ID отсутствует или уже встречался, создаем новый
      if (!id || seenIds.has(id)) {
        id = `notif_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`;
      }
      seenIds.add(id);
      return { ...notif, id };
    });
    return uniqueNotifications;
  });

  // Сохранение уведомлений в localStorage
  useEffect(() => {
    localStorage.setItem('mell_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notification) => {
    counterRef.current += 1;
    // Генерируем уникальный ID: timestamp + счетчик + случайная строка
    const uniqueId = `notif_${Date.now()}_${counterRef.current}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newNotification = {
      id: uniqueId,
      title: notification.title || 'Уведомление',
      message: notification.message || '',
      type: notification.type || 'info', // info, success, warning, error
      read: false,
      timestamp: Date.now(),
      ...notification
    };
    
    // Перезаписываем id, чтобы гарантировать уникальность
    newNotification.id = uniqueId;
    
    setNotifications(prev => [newNotification, ...prev]);
    return newNotification.id;
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const value = {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    unreadCount
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

