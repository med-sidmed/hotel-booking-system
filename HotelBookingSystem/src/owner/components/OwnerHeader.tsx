import { Bell, Moon, Search, Sun, User } from 'lucide-react';
import { useState } from 'react';

export function OwnerHeader() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <header className="bg-white dark:bg-[#1A1A1A] h-16 shadow-sm border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 transition-colors duration-300">
      <div className="relative w-96">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </span>
        <input
          className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg leading-5 bg-gray-50 dark:bg-[#2A2A2A] text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#C6A87C] focus:border-[#C6A87C] sm:text-sm transition-colors"
          type="search"
          placeholder="Rechercher (Ctrl+K)..."
        />
      </div>

      <div className="flex items-center space-x-4">
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 text-gray-400 hover:text-[#C6A87C] transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
           {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="p-2 text-gray-400 hover:text-[#C6A87C] transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative">
           <Bell size={20} />
           <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1A1A1A]"></span>
        </button>
        
        <div className="flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-gray-700">
            <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Sophie Martin</p>
                <p className="text-xs text-gray-500">Propriétaire</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#C6A87C]/10 flex items-center justify-center text-[#C6A87C] border border-[#C6A87C]/20">
                <User size={20} />
            </div>
        </div>
      </div>
    </header>
  );
}
