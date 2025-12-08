import { useState } from 'react';
import './Testimonials.css';

interface Testimonial {
  id: number;
  text: string;
  author: string;
  location: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    text: "J'ai utilisé ma réduction - elle a été appliquée instantanément. Réservé en quelques secondes !",
    author: "Hannah A.",
    location: "Nouakchott"
  },
  {
    id: 2,
    text: "J'ai eu une chambre propre à l'hôtel. La vue était magnifique !",
    author: "Hamza K.",
    location: "Nouadhibou"
  },
  {
    id: 3,
    text: "Voyage organisé grâce à la réservation de dernière minute de Luxotel.",
    author: "James L.",
    location: "Atar"
  },
  {
    id: 4,
    text: "Excellent service et superbes offres. Je réserverai certainement à nouveau !",
    author: "Sarah M.",
    location: "Rosso"
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  const getVisibleTestimonials = () => {
    const start = currentIndex * itemsPerPage;
    return testimonials.slice(start, start + itemsPerPage);
  };

  return (
    <section className="testimonials">
      <div className="testimonials-banner">
        <h2>CE QUE DISENT NOS VISITEURS</h2>
      </div>
      <div className="testimonials-container">
        <div className="testimonials-controls">
          <button className="nav-arrow left" onClick={goToPrevious} aria-label="Précédent">
            ‹
          </button>
          <span className="page-indicator">{currentIndex + 1}/{totalPages}</span>
          <button className="nav-arrow right" onClick={goToNext} aria-label="Suivant">
            ›
          </button>
        </div>
        <div className="testimonials-grid">
          {getVisibleTestimonials().map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="quote-icon">"</div>
              <p className="testimonial-text">{testimonial.text}</p>
              <div className="testimonial-author">
                <span className="author-name">{testimonial.author}</span>
                <span className="author-location">{testimonial.location}</span>
              </div>
              <div className="card-background"></div>
            </div>
          ))}
        </div>
        <button className="submit-review-btn">
          <span className="pencil-icon">✎</span>
          Soumettre votre avis
        </button>
      </div>
    </section>
  );
};

export default Testimonials;

