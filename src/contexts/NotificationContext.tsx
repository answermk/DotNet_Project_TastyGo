import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

type Notification = {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  read: boolean;
  timestamp: Date;
};

// Update the NotificationContextType to match the actual parameters
type NotificationContextType = {
  notifications: Notification[];
  addNotification: (type: NotificationType, message: string, title?: string) => void;
  // ... other member
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  unreadCount: number;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((type: NotificationType, message: string, title?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotification: Notification = {
      id,
      type,
      message,
      title,
      read: false,
      timestamp: new Date(),
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show toast notification
    switch (type) {
      case 'success':
        toast.success(message, { position: 'top-right' });
        break;
      case 'error':
        toast.error(message, { position: 'top-right' });
        break;
      case 'warning':
        toast.warning(message, { position: 'top-right' });
        break;
      case 'info':
        toast.info(message, { position: 'top-right' });
        break;
    }
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        unreadCount,
      }}
    >
      {children}
      <ToastContainer />
    </NotificationContext.Provider>
  );
};