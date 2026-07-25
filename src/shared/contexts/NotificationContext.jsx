import { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext(undefined);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      read: false,
      createdAt: new Date().toISOString(),
      ...notification,
    };

    setNotifications((prev) => [newNotification, ...prev]);
    return newNotification.id;
  }, []);

  const markAsRead = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const removeNotification = useCallback((notificationId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const setNotificationsList = useCallback((list) => {
    setNotifications(list);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
        setNotificationsList,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (context === undefined) {
    throw new Error(
      "useNotifications doit être utilisé dans un NotificationProvider"
    );
  }

  return context;
}
