import { Bell, Search, User } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { useState } from 'react';

export function ClientHeader() {
  const { unreadCount, notifications, markAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-white h-16 shadow-sm border-b border-gray-200 flex items-center justify-between px-6">
      <div className="relative w-96">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </span>
        <input
          className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent sm:text-sm"
          type="search"
          placeholder="Rechercher un hôtel, une réservation..."
        />
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-400 hover:text-[#C6A87C] transition-colors rounded-full hover:bg-gray-100 relative"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
              <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                <span className="text-xs bg-[#C6A87C] text-white px-2 py-0.5 rounded-full">{unreadCount}</span>
              </div>
              <div className="divide-y divide-gray-100">
                {notifications.slice(0, 5).map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    className={`p-3 cursor-pointer hover:bg-gray-50 ${!notif.read ? 'bg-blue-50' : ''}`}
                  >
                    <h4 className="text-sm font-medium text-gray-900">{notif.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(notif.date).toLocaleDateString('fr-FR')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">Sophie Martin</p>
            <p className="text-xs text-gray-500">Gold Member</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#C6A87C]/10 flex items-center justify-center text-[#C6A87C] border border-[#C6A87C]/20">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}
