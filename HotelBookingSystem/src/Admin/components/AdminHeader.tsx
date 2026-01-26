import { Bell, Search, ChevronDown, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import { NotificationDropdown } from '../../components/common/NotificationDropdown';

export function AdminHeader() {
  const { unreadCount } = useNotifications();
  const { theme, setTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-[#FDF8F3] h-16 shadow-sm flex items-center justify-between px-8 border-b border-gray-200">
      <div className="relative w-96">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </span>
        <input
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#6B5434] focus:border-[#6B5434] sm:text-sm transition-all"
          type="search"
          placeholder="Rechercher..."
        />
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-400 hover:text-[#6B5434] transition-colors rounded-full hover:bg-white relative shadow-sm border border-transparent hover:border-gray-200"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-600 rounded-full border-2 border-[#FDF8F3] flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>
              </span>
            )}
          </button>
          
          <NotificationDropdown 
            isOpen={showNotifications} 
            onClose={() => setShowNotifications(false)} 
          />
        </div>

        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 text-gray-400 hover:text-[#6B5434] dark:hover:text-[#C6A87C] transition-all rounded-full hover:bg-white dark:hover:bg-gray-800"
          title={`Mode ${theme === 'dark' ? 'Clair' : 'Sombre'}`}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="h-6 w-[1px] bg-gray-200 dark:bg-gray-700"></div>
        
        <div className="flex items-center space-x-3 cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-[#6B5434] flex items-center justify-center text-white font-bold shadow-md transform group-hover:scale-105 transition-all">
                A
            </div>
            <div className="hidden md:block">
              <p className="text-gray-800 font-bold text-sm leading-tight">Admin User</p>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>
            <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
        </div>
      </div>
    </header>
  );
}
