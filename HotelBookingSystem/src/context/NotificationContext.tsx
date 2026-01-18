import { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import type { Notification } from '../types';
import { mockNotifications } from '../data/mockData';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'date' | 'read' | 'userId'> & { userId?: string | number }) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  unreadCount: number;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [allNotifications, setAllNotifications] = useState<Notification[]>(mockNotifications);

  // Filter notifications based on the current user
  const userNotifications = useMemo(() => {
    if (!isAuthenticated || !user) return [];
    return allNotifications.filter(n => n.userId === user.id);
  }, [allNotifications, user, isAuthenticated]);

  const addNotification = (notif: Omit<Notification, 'id' | 'date' | 'read' | 'userId'> & { userId?: string | number }) => {
    const newNotif: Notification = {
      ...notif,
      userId: notif.userId || user?.id || 'system',
      id: `NOT-${Date.now()}`,
      date: new Date().toISOString(),
      read: false
    };
    setAllNotifications(prev => [newNotif, ...prev]);
    
    // Only show toast if it's for the current user
    if (!notif.userId || notif.userId === user?.id) {
      showToast(notif.title, 'info');
    }
  };

  const markAsRead = (id: string) => {
    setAllNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    if (!user) return;
    setAllNotifications(prev => 
      prev.map(n => n.userId === user.id ? { ...n, read: true } : n)
    );
  };

  const unreadCount = userNotifications.filter(n => !n.read).length;

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
      notifications: userNotifications,
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
