import { createContext, useContext, useState, useMemo, useEffect, useCallback, type ReactNode } from 'react';
import type { Notification } from '../types';
import { notificationService } from '../api/notification.service';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface NotificationContextType {
  notifications: Notification[];
  refreshNotifications: () => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id' | 'date' | 'read' | 'userId'> & { userId?: string | number }) => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  unreadCount: number;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const refreshNotifications = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshNotifications();
      // Simple polling for new notifications every 60 seconds
      const interval = setInterval(refreshNotifications, 60000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
    }
  }, [isAuthenticated, refreshNotifications]);

  const addNotification = (notif: Omit<Notification, 'id' | 'date' | 'read' | 'userId'> & { userId?: string | number }) => {
    // This is primarily for local UI feeedback or system-level local alerts
    const newNotif: Notification = {
      ...notif,
      userId: notif.userId || user?.id || 'system',
      id: `NOT-LOCAL-${Date.now()}`,
      date: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    
    if (!notif.userId || notif.userId === user?.id) {
      showToast(notif.title, 'info');
    }
  };

  const markAsRead = async (id: string) => {
    if (id.startsWith('NOT-LOCAL-')) {
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
      return;
    }

    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      toast.error('Erreur lors du marquage comme lu');
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    try {
      // Optimistic update
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      await notificationService.markAllAsRead();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
      refreshNotifications(); // Revert on error
    }
  };

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      default:
        toast(message, {
            icon: '🔔',
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        });
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      refreshNotifications,
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
