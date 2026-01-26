import { useFavorites } from '../../context/FavoritesContext';
import { hotels } from '../../data/mockData';
import { HotelCard } from '../../components/HotelCard';
import { Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MyFavorites() {
  const { favorites } = useFavorites();
  
  const favoriteHotels = hotels.filter(hotel => favorites.includes(hotel.id));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mes Favoris</h1>
          <p className="text-gray-500 text-sm mt-1">
            Retrouvez ici tous les établissements que vous avez aimés
          </p>
        </div>
        <div className="bg-[#C6A87C]/10 px-4 py-2 rounded-lg border border-[#C6A87C]/20 flex items-center gap-2">
          <Heart size={20} className="text-[#C6A87C] fill-[#C6A87C]" />
          <span className="font-bold text-[#C6A87C]">{favoriteHotels.length}</span>
        </div>
      </div>

      {favoriteHotels.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={40} className="text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Vous n'avez pas encore de favoris</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Explorez nos hôtels et cliquez sur le cœur pour les ajouter à votre liste de favoris personnelle.
          </p>
          <Link 
            to="/hotels" 
            className="inline-flex items-center gap-2 bg-[#6B5434] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#5B4424] transition-all shadow-lg hover:shadow-xl"
          >
            Découvrir les hôtels
            <ArrowRight size={20} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {favoriteHotels.map(hotel => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      )}
    </div>
  );
}
