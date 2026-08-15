import { createContext, useState, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "./SocketContext";
import { useAuth } from "./AuthContext";
import { markNotificationRead, markAllNotificationsRead } from "../services/socket";

export const NotificationContext = createContext(undefined);

export function NotificationProvider({ children }) {
  const { on, connected } = useSocket();
  const { user, setUser } = useAuth();
  const queryClient = useQueryClient();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user?.unreadNotifications !== undefined) {
      setUnreadCount(user.unreadNotifications);
    }
  }, [user?.unreadNotifications]);

  useEffect(() => {
    if (!connected) return;

    const unsubNotification = on("notification", (notification) => {
      setUnreadCount((prev) => prev + 1);
      setUser((prev) => prev ? { ...prev, unreadNotifications: (prev.unreadNotifications || 0) + 1 } : prev);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadNotificationCount"] });
    });

    return () => {
      unsubNotification?.();
    };
  }, [connected, on, setUser, queryClient]);

  const markAsRead = useCallback((notificationId) => {
    markNotificationRead(notificationId);
    setUnreadCount((prev) => Math.max(0, prev - 1));
    setUser((prev) => prev ? { ...prev, unreadNotifications: Math.max(0, (prev.unreadNotifications || 0) - 1) } : prev);
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({ queryKey: ["unreadNotificationCount"] });
  }, [setUser, queryClient]);

  const markAllAsRead = useCallback(() => {
    markAllNotificationsRead();
    setUnreadCount(0);
    setUser((prev) => prev ? { ...prev, unreadNotifications: 0 } : prev);
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({ queryKey: ["unreadNotificationCount"] });
  }, [setUser, queryClient]);

  const clearAll = useCallback(() => {
    setUnreadCount(0);
    setUser((prev) => prev ? { ...prev, unreadNotifications: 0 } : prev);
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({ queryKey: ["unreadNotificationCount"] });
  }, [setUser, queryClient]);

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
