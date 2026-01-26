import './Header.css';
import { useNavigate, Link } from 'react-router-dom';
import { Bell, User, LogIn, LogOut, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { NotificationDropdown } from './common/NotificationDropdown';

const Header = () => {
    const navigate = useNavigate();
    const { unreadCount } = useNotifications();
    const { user, isAuthenticated, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-top-content">
          <div className="social-section">
            <span>SUIVEZ-NOUS SUR</span>
            <div className="social-icons">
              <a href="#" aria-label="Facebook" className="social-icon">f</a>
              <a href="#" aria-label="Instagram" className="social-icon">📷</a>
              <a href="#" aria-label="Twitter" className="social-icon">t</a>
            </div>
          </div>
          <div className="header-top-right flex items-center gap-4">
            {/* Notification Bell for logged in users */}
            {isAuthenticated && (
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-1.5 text-white/80 hover:text-white transition-colors relative"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center border border-black">
                      <span className="text-[8px] font-bold text-white">{unreadCount}</span>
                    </span>
                  )}
                </button>
                
                <NotificationDropdown 
                  isOpen={showNotifications} 
                  onClose={() => setShowNotifications(false)} 
                  userId={user?.id as any}
                />
              </div>
            )}

            {isAuthenticated && <div className="h-4 w-[1px] bg-white/20"></div>}

            {isAuthenticated ? (
              <button 
                className="flex items-center gap-2 text-white/90 hover:text-red-400 transition-colors text-xs font-bold uppercase tracking-widest" 
                onClick={logout}
              >
                <LogOut size={14} />
                Déconnexion
              </button>
            ) : (
              <button 
                className="flex items-center gap-2 text-white/90 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest" 
                onClick={() => navigate('/login')}
              >
                <LogIn size={14} />
                Connexion
              </button>
            )}

            <div className="h-4 w-[1px] bg-white/20"></div>

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 text-white/80 hover:text-white transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center"
              title={`Passer en mode ${theme === 'dark' ? 'clair' : 'sombre'}`}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
           </div>
        </div>
      </div>
      <nav className="main-nav">
        <div className="nav-content">
          <Link to="/" className="logo">LUXOTEL</Link>
          <ul className="nav-menu">
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/hotels">Hôtels & Resorts</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            {isAuthenticated && (
              <li><Link to={user?.role === 'ADMIN' ? '/admin' : user?.role === 'OWNER' ? '/owner' : '/profile'}>Mon Dashboard</Link></li>
            )}
          </ul>

          <div className="flex items-center gap-3 ml-8 pl-8 border-l border-gray-100/10">
            {isAuthenticated ? (
              <Link to="/profile" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full bg-[#C6A87C]/20 flex items-center justify-center text-[#C6A87C] border border-[#C6A87C]/30 group-hover:bg-[#C6A87C]/30 transition-colors overflow-hidden">
                  {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : <User size={16} />}
                </div>
                <span className="text-white text-xs font-medium hidden md:block">{user?.name}</span>
              </Link>
            ) : (
              <Link to="/login" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors border border-white/20">
                <User size={16} />
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;

