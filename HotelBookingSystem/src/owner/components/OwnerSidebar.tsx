import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Hotel, 
  CalendarDays, 
  CreditCard, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Info,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

export function OwnerSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: 'Tableau de bord', path: '/owner', icon: LayoutDashboard },
    { name: 'Informations Hôtel', path: '/owner/hotel-info', icon: Info },
    { name: 'Mes Chambres', path: '/owner/rooms', icon: Hotel },
    { name: 'Réservations', path: '/owner/bookings', icon: CalendarDays },
    { name: 'Messages', path: '/owner/messages', icon: MessageSquare }, // Added
    { name: 'Calendrier', path: '/owner/calendar', icon: Calendar },
    { name: 'Finances', path: '/owner/finance', icon: CreditCard },
    { name: 'Paramètres', path: '/owner/settings', icon: Settings },
  ];

  return (
    <div className={cn(
      "bg-[#1A1A1A] text-white min-h-screen flex flex-col transition-all duration-300 relative border-r border-gray-800",
      collapsed ? "w-20" : "w-64"
    )}>
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 bg-[#C6A87C] rounded-full p-1 text-white hover:bg-[#B5966A] transition-colors z-20"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div className={cn("p-6 flex items-center justify-center border-b border-gray-800", collapsed ? "px-2" : "")}>
        {collapsed ? (
           <span className="text-xl font-bold text-[#C6A87C]">H</span>
        ) : (
           <div className="text-center">
             <h1 className="text-xl font-bold tracking-wider text-white">HOTEL <span className="text-[#C6A87C]"> MANAGER</span></h1>
             <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Manager Panel</p>
           </div>
        )}
      </div>

      <nav className="flex-1 px-3 space-y-2 mt-6 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center px-3 py-3 rounded-lg transition-all group",
              isActive(item.path)
                ? 'bg-[#C6A87C] text-white shadow-lg shadow-[#C6A87C]/20'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white',
              collapsed ? "justify-center" : ""
            )}
            title={collapsed ? item.name : undefined}
          >
            <item.icon className={cn("flex-shrink-0 transition-colors", isActive(item.path) ? "text-white" : "text-gray-400 group-hover:text-white")} size={20} />
            {!collapsed && (
              <span className="ml-3 font-medium truncate">{item.name}</span>
            )}
            {!collapsed && isActive(item.path) && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
            )}
          </Link>
        ))}
      </nav>

       <div className="p-4 border-t border-gray-800">
        <button onClick={logout} className={cn(
          "flex items-center w-full px-3 py-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors",
          collapsed ? "justify-center" : ""
        )}>
            <LogOut size={20} />
            {!collapsed && <span className="ml-3 font-medium">Déconnexion</span>}
        </button>
      </div>
    </div>
  );
}
