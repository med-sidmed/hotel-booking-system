import { useRef, useEffect } from 'react';
import { Bell, Check, Calendar, DollarSign, MessageSquare, Tag } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: number | string; // Optional: filter by user if provided
}

export function NotificationDropdown({ isOpen, onClose, userId }: NotificationDropdownProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter notifications if userId is provided, otherwise show all (for admin/demo)
  const filteredNotifications = userId 
    ? notifications.filter(n => n.userId === userId)
    : notifications;

  const currentUnreadCount = userId 
    ? filteredNotifications.filter(n => !n.read).length
    : unreadCount;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'BOOKING_CONFIRMED':
      case 'BOOKING_CANCELLED':
        return <Calendar className="text-blue-600" size={18} />;
      case 'PAYMENT_SUCCESS':
        return <DollarSign className="text-green-600" size={18} />;
      case 'MESSAGE':
        return <MessageSquare className="text-purple-600" size={18} />;
      case 'PROMOTION':
        return <Tag className="text-orange-600" size={18} />;
      default:
        return <Bell className="text-gray-600" size={18} />;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "À l'instant";
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-[#1A1A1A] rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 z-[100] overflow-hidden animate-in fade-in zoom-in duration-200"
    >
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
        <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
        {currentUnreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-[#C6A87C] hover:text-[#B5966A] font-medium transition-colors"
          >
            Tout marquer comme lu
          </button>
        )}
      </div>

      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="mx-auto text-gray-300 mb-3" size={40} />
            <p className="text-gray-500 text-sm">Aucune notification</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`px-4 py-4 border-b border-gray-50 dark:border-gray-800/50 transition-colors ${
                !notif.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800/30'
              }`}
            >
              <div className="flex gap-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  !notif.read ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-800'
                }`}>
                  {getNotificationIcon(notif.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className={`text-sm font-bold truncate ${
                      !notif.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {notif.title}
                    </h4>
                    {!notif.read && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full transition-colors"
                        title="Marquer comme lu"
                      >
                        <Check size={14} />
                      </button>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                    {notif.message}
                  </p>
                  
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[10px] items-center flex font-medium text-gray-400 dark:text-gray-500">
                      {getTimeAgo(notif.date)}
                    </span>
                    {notif.actionUrl && (
                      <a
                        href={notif.actionUrl}
                        className="text-[10px] font-bold text-[#C6A87C] hover:text-[#B5966A] uppercase tracking-wider transition-colors"
                        onClick={() => onClose()}
                      >
                        Détails →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 text-center bg-gray-50/30 dark:bg-gray-800/30">
        <button
          className="text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors uppercase tracking-widest"
          onClick={() => onClose()}
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
