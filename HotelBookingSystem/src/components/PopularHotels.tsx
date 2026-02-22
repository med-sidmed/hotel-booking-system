import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { hotelService } from '../api/hotel.service';
import type { Hotel } from '../types';
import './PopularHotels.css';

const PopularHotels = () => {
  const navigate = useNavigate();
  const [popularHotels, setPopularHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularHotels = async () => {
      try {
        const data = await hotelService.getHotels();
        setPopularHotels(data.slice(0, 4));
      } catch (err) {
        console.error('Failed to fetch hotels:', err);
        setError('Impossible de charger les hôtels populaires.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPopularHotels();
  }, []);

  if (isLoading) {
    return <section className="popular-hotels"><div className="popular-hotels-container"><p>Chargement...</p></div></section>;
  }

  if (error) {
    return <section className="popular-hotels"><div className="popular-hotels-container"><p className="error-text">{error}</p></div></section>;
  }

  return (
    <section className="popular-hotels">
      <div className="popular-hotels-container">
        <h2 className="section-title">HÔTELS LES PLUS POPULAIRES</h2>
        <div className="hotels-grid">
          {popularHotels.map((hotel) => (
            <div key={hotel.id} className="hotel-card">
              <div className="hotel-image">
                <img 
                  src={hotel.image || (hotel.images && hotel.images[0]) || 'https://via.placeholder.com/400x300?text=No+Image'} 
                  alt={hotel.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <div className="hotel-info">
                <h3 className="hotel-name">{hotel.name}</h3>
                <p className="hotel-location">{hotel.location}</p>
                <p className="hotel-description">{hotel.description}</p>
                <button 
                  className="hotel-book-btn"
                  onClick={() => navigate(`/hotels/${hotel.id}`)}
                >
                  Voir les détails
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularHotels;


