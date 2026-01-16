import './PopularHotels.css';

interface Hotel {
  id: number;
  name: string;
  location: string;
  description: string;
  image: string;
}

const hotels: Hotel[] = [
  {
    id: 1,
    name: "Hôtel One - Nouakchott",
    location: "Nouakchott",
    description: "Hôtel confortable en bord de mer, parfait pour les familles.",
    image: "hotel1",
    roo
  },
  {
    id: 2,
    name: "PC Hôtel - Nouadhibou",
    location: "Nouadhibou",
    description: "Un choix premium pour les séjours d'affaires.",
    image: "hotel2"
  },
  {
    id: 3,
    name: "Royalton Hôtel - Atar",
    location: "Atar",
    description: "Hôtel moderne en ville, idéal pour les séjours d'affaires.",
    image: "hotel3"
  },
  {
    id: 4,
    name: "Pearl Continental - Rosso",
    location: "Rosso",
    description: "Séjour de luxe dans un centre-ville animé.",
    image: "hotel4"
  }
];

const PopularHotels = () => {
  return (
    <section className="popular-hotels">
      <div className="popular-hotels-container">
        <h2 className="section-title">HÔTELS LES PLUS POPULAIRES</h2>
        <div className="hotels-grid">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="hotel-card">
              <div className="hotel-image">
                <div className="hotel-image-placeholder">
                  <span>🏨</span>
                </div>
              </div>
              <div className="hotel-info">
                <h3 className="hotel-name">{hotel.name}</h3>
                <p className="hotel-location">{hotel.location}</p>
                <p className="hotel-description">{hotel.description}</p>
                <button className="hotel-book-btn">Voir les détails</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularHotels;

