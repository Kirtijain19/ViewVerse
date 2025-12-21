import React, { createContext, useCallback, useEffect, useState } from 'react';

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addNotification = useCallback((notification) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    const n = {
      id,
      type: notification.type || 'info',
      message: notification.message || '',
      duration: typeof notification.duration === 'number' ? notification.duration : 5000,
    };
    setNotifications((prev) => [n, ...prev]);

    if (n.duration > 0) {
      setTimeout(() => removeNotification(id), n.duration);
    }
    return id;
  }, [removeNotification]);

  const clearNotifications = useCallback(() => setNotifications([]), []);

  const notifySuccess = useCallback((message, duration) => addNotification({ type: 'success', message, duration }), [addNotification]);
  const notifyError = useCallback((message, duration) => addNotification({ type: 'error', message, duration }), [addNotification]);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    notifySuccess,
    notifyError,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;