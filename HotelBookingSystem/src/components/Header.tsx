import './Header.css';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
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
          <div className="header-top-right">
        
            <button className="login-btn" onClick={() => navigate('/login')}>Connexion</button>
           </div>
        </div>
      </div>
      <nav className="main-nav">
        <div className="nav-content">
          <div className="logo">LUXOTEL</div>
          <ul className="nav-menu">
            <li><a href="/">Accueil</a></li>
            <li><a href="/hotels">Hôtels & Resorts</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/my-bookings">Ma Réservation</a></li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;

