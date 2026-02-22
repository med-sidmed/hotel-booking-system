import { useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import type { Hotel } from "../types";

interface HotelCardProps {
  hotel: Hotel;
}

export function HotelCard({ hotel }: HotelCardProps) {
  const navigate = useNavigate();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const isFav = isFavorite(hotel.id);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigating to hotel details
    if (isFav) {
      removeFavorite(hotel.id);
    } else {
      addFavorite(hotel);
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 relative">
          <img
            src={hotel.image || (hotel.images && hotel.images[0]) || 'https://via.placeholder.com/400x300?text=No+Image'}
            alt={hotel.name}
            className="w-full h-64 md:h-full object-cover"
          />
          <button
            onClick={toggleFavorite}
            className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors shadow-sm"
            title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={isFav ? "red" : "none"}
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke={isFav ? "red" : "currentColor"}
              className="w-6 h-6 transition-colors"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          </button>
        </div>

        <div className="md:w-2/3 bg-[#9B8365] text-white p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>

            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-sm">
                  ★
                </span>
              ))}
              <span className="ml-2 text-sm opacity-90">
                ({hotel.reviews || 0} avis)
              </span>
            </div>

            <p className="text-sm opacity-90 mb-3 flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              {hotel.location}
            </p>

            <p className="text-sm leading-relaxed opacity-90 line-clamp-2">
              {hotel.description}
            </p>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm font-medium">{hotel.rooms?.length || 0} Chambres dispo</span>
            <button 
              onClick={() => navigate(`/hotels/${hotel.id}`)}
              className="bg-[#6B5434] hover:bg-[#5B4424] text-white px-6 py-2 rounded-md text-sm font-semibold transition-colors"
            >
              Voir les chambres
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
