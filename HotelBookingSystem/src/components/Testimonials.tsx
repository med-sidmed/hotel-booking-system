import { useState } from 'react';
import './Testimonials.css';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from './ui/dialog';
import { Button } from './ui/button';
import type { Review } from '../types/Reviews';

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
      </div>
    </section>
  );
};

export default Testimonials;

export const SubmitReview = () => {
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newReview: Partial<Review> = {
        rating: parseInt(rating),
        comment: comment,
        createdAt: new Date().toISOString(),
        // userId would typically come from auth context
    };

    console.log('Valid Review:', newReview);
    alert("Merci pour votre avis ! (Simulation)");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="submit-review-btn">
          <span className="pencil-icon">✎</span>
          Soumettre votre avis
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white text-[#3d2817] z-[9999]">
        <DialogHeader>
          <DialogTitle>Partagez votre expérience</DialogTitle>
          <DialogDescription>
            Votre avis nous aide à nous améliorer et aide les autres voyageurs.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="rating" className="text-right font-medium">
              Note
            </label>
            <select
              id="rating"
              className="col-span-3 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6B5434]"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value="5">⭐⭐⭐⭐⭐ (Excellent)</option>
              <option value="4">⭐⭐⭐⭐ (Très bien)</option>
              <option value="3">⭐⭐⭐ (Bien)</option>
              <option value="2">⭐⭐ (Moyen)</option>
              <option value="1">⭐ (Mauvais)</option>
            </select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
             <label htmlFor="comment" className="text-right font-medium self-start mt-2">
              Avis
            </label>
            <textarea
              id="comment"
              className="col-span-3 border border-gray-300 rounded px-3 py-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-[#6B5434]"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">Annuler</Button>
            </DialogClose>
            <Button type="submit" className="bg-[#6B5434] hover:bg-[#5B4424] text-white">Soumettre</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

