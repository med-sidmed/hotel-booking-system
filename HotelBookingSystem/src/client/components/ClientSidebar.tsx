import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar,
  Heart,
  User,
  CreditCard,
  Gift,
  LogOut,
  Star,
  Home,
  MessageSquare
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '@/context/AuthContext';


export function ClientSidebar() {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: 'Tableau de Bord', path: '/profile', icon: LayoutDashboard },
    { name: 'Mes Réservations', path: '/profile/bookings', icon: Calendar },
    { name: 'Messages', path: '/profile/messages', icon: MessageSquare }, // Added
    { name: 'Mes Favoris', path: '/profile/favorites', icon: Heart },
    { name: 'Mes Avis', path: '/profile/reviews', icon: Star },
    { name: 'Paiements', path: '/profile/payments', icon: CreditCard },
    { name: 'Fidélité', path: '/profile/loyalty', icon: Gift },
    { name: 'Paramètres', path: '/profile/settings', icon: User },
    { name: 'Accueil', path: '/', icon: Home },
  ];

  return (
    <div className="bg-white w-64 min-h-screen flex flex-col border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">
          MON <span className="text-[#C6A87C]">ESPACE</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">Gestion de mon compte</p>
      </div>

      <nav className="flex-1 px-3 space-y-1 mt-6">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center px-3 py-3 rounded-lg transition-all group",
              isActive(item.path)
                ? 'bg-[#C6A87C] text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            <item.icon 
              className={cn(
                "flex-shrink-0",
                isActive(item.path) ? "text-white" : "text-gray-400 group-hover:text-[#C6A87C]"
              )} 
              size={20} 
            />
            <span className="ml-3 font-medium">{item.name}</span>
            {isActive(item.path) && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
            )}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button onClick={logout} className="flex items-center w-full px-3 py-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
          <LogOut size={20} />
          <span className="ml-3 font-medium">Déconnexion</span>
        </button>
      </div>  
    </div>
  );
}
