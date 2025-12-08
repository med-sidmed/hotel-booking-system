import { useState } from 'react';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
    alert('Merci de vous être abonné !');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="back-to-top">
        <button onClick={scrollToTop}>Retour en haut</button>
      </div>
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-brand">
            <h3 className="footer-logo">LUXOTEL</h3>
            <p className="footer-description">
              Le compagnon de voyage de confiance de la Mauritanie depuis 2020. Nous connectons les voyageurs aux meilleurs hôtels et resorts de la Mauritanie, offrant des avis authentiques, des hébergements vérifiés et des expériences de réservation sans faille.
            </p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Liens rapides</h4>
              <ul>
                <li><a href="#contact">Contactez-nous</a></li>
                <li><a href="#about">À propos</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Légal</h4>
              <ul>
                <li><a href="#privacy">Confidentialité</a></li>
                <li><a href="#terms">Conditions générales</a></li>
              </ul>
            </div>
            <div className="footer-newsletter">
              <h4>SUIVEZ-NOUS SUR</h4>
              <div className="social-icons">
                <a href="#" aria-label="Facebook" className="social-icon facebook">f</a>
                <a href="#" aria-label="Instagram" className="social-icon instagram">📷</a>
                <a href="#" aria-label="Twitter" className="social-icon twitter">t</a>
                <a href="#" aria-label="YouTube" className="social-icon youtube">▶</a>
              </div>
              <form onSubmit={handleSubmit} className="newsletter-form">
                <label htmlFor="newsletter-email">Abonnez-vous à notre newsletter</label>
                <div className="newsletter-input-group">
                  <input
                    type="email"
                    id="newsletter-email"
                    placeholder="Entrez votre email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit">S'abonner</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© LUXOTEL - Votre compagnon de voyage de confiance depuis 2020</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

