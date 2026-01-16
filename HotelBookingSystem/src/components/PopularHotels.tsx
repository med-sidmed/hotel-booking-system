import { useNavigate } from 'react-router-dom';
import { hotels } from '../data/mockData';
import './PopularHotels.css';

const PopularHotels = () => {
  const navigate = useNavigate();

  return (
    <section className="popular-hotels">
      <div className="popular-hotels-container">
        <h2 className="section-title">HÔTELS LES PLUS POPULAIRES</h2>
        <div className="hotels-grid">
          {hotels.slice(0, 4).map((hotel) => (
            <div key={hotel.id} className="hotel-card">
              <div className="hotel-image">
                <img src={hotel.image} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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


