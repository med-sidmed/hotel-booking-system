import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Notification } from '../types';
import { mockNotifications } from '../data/mockData';
import toast from 'react-hot-toast';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'date' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  unreadCount: number;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const addNotification = (notif: Omit<Notification, 'id' | 'date' | 'read'>) => {
    const newNotif: Notification = {
      ...notif,
      id: `NOT-${Date.now()}`,
      date: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    showToast(notif.title, 'info');
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      default:
        toast(message);
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      markAsRead,
      markAllAsRead,
      unreadCount,
      showToast
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
}
