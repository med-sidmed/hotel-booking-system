import { useState } from 'react';
import './Hero.css';

const Hero = () => {
  const [searchData, setSearchData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    persons: '2',
    rooms: '1'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Recherche:', searchData);
    // Handle search logic here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="hero">
      <div className="hero-background">
        <div className="hero-overlay"></div>
      </div>
      <div className="hero-content">
        <div className="hero-text">
          <h1>Réservez plus intelligemment, voyagez mieux</h1>
        </div>
        <div className="search-container">
          <form onSubmit={handleSubmit} className="search-form">
            <div className="search-field">
              <label>Rechercher les meilleurs hôtels en Mauritanie</label>
              <input
                type="text"
                name="destination"
                placeholder="Destination"
                value={searchData.destination}
                onChange={handleChange}
              />
            </div>
            <div className="search-field">
              <label>Date d'arrivée</label>
              <input
                type="date"
                name="checkIn"
                value={searchData.checkIn}
                onChange={handleChange}
              />
            </div>
            <div className="search-field">
              <label>Date de départ</label>
              <input
                type="date"
                name="checkOut"
                value={searchData.checkOut}
                onChange={handleChange}
              />
            </div>
            <div className="search-field">
              <label>Personnes</label>
              <select
                name="persons"
                value={searchData.persons}
                onChange={handleChange}
              >
                <option value="1">1 Personne</option>
                <option value="2">2 Personnes</option>
                <option value="3">3 Personnes</option>
                <option value="4">4 Personnes</option>
                <option value="5+">5+ Personnes</option>
              </select>
            </div>
            <div className="search-field">
              <label>Chambres</label>
              <select
                name="rooms"
                value={searchData.rooms}
                onChange={handleChange}
              >
                <option value="1">1 Chambre</option>
                <option value="2">2 Chambres</option>
                <option value="3">3 Chambres</option>
                <option value="4+">4+ Chambres</option>
              </select>
            </div>
            <button type="submit" className="search-btn">Rechercher</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Hero;

