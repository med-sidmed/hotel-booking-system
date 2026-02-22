import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Hotel, 
  Calendar, 
  Users, 
  Settings,
  TrendingUp,
  CreditCard,
  Tag,
  Globe,
  LogOut,
  MessageSquare,
  Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function AdminSidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navSections = [
    {
      title: 'Principal',
      items: [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
      ]
    },
    {
      title: 'Gestion',
      items: [
        { name: 'Hôtels', path: '/admin/hotels', icon: Hotel },
        { name: 'Réservations', path: '/admin/bookings', icon: Calendar },
        { name: 'Avis clients', path: '/admin/reviews', icon: MessageSquare },
        { name: 'Utilisateurs', path: '/admin/users', icon: Users },
      ]
    },
    {
      title: 'Business',
      items: [
        { name: 'Analytics', path: '/admin/analytics', icon: TrendingUp },
        { name: 'Promotions', path: '/admin/promotions', icon: Tag },
        { name: 'Transactions', path: '/admin/transactions', icon: CreditCard },
      ]
    },
    {
      title: 'Système',
      items: [
        { name: 'Calendrier Global', path: '/admin/calendar', icon: Calendar },
        { name: 'Configuration', path: '/admin/config', icon: Globe },
        { name: 'Paramètres', path: '/admin/settings', icon: Settings },
      ]
    }
  ];

  return (
    <div className="w-64 bg-[#4A3728] text-white min-h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-wider">LUXOTEL</h1>
        <p className="text-xs text-[#AC9B86] mt-1">Admin Dashboard</p>
      </div>

      <nav className="flex-1 px-3 space-y-6 mt-4 overflow-y-auto">
        {navSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <p className="px-4 text-xs font-semibold text-[#AC9B86] uppercase tracking-wider mb-2">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors group ${
                    isActive(item.path)
                      ? 'bg-[#C6A87C] text-white font-medium shadow-md'
                      : 'text-[#DDCDBF] hover:bg-[#5C4836] hover:text-white'
                  }`}
                >
                  <item.icon 
                    className={`flex-shrink-0 mr-3 ${
                      isActive(item.path) ? 'text-white' : 'text-[#AC9B86] group-hover:text-white'
                    }`}
                    size={20}
                  />
                  <span className="text-sm">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-[#5C4836]">
        <button onClick={logout} className="flex items-center w-full px-4 py-2 text-[#DDCDBF] hover:text-white transition-colors rounded-lg hover:bg-[#5C4836]">
          <LogOut size={20} className="mr-3" />
          <span className="text-sm">Déconnexion</span>
        </button>
      </div>
    </div>
  );
}
