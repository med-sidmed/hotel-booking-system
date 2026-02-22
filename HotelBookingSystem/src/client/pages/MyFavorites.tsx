import { useFavorites } from '../../context/FavoritesContext';
import { HotelCard } from '../../components/HotelCard';
import { Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MyFavorites() {
  const { favorites } = useFavorites();
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Mes Coups de Cœur</h1>
          <p className="text-gray-500 text-sm mt-1 font-medium italic">
            Retrouvez ici tous les établissements que vous avez sélectionnés
          </p>
        </div>
        <div className="bg-[#C6A87C]/10 px-6 py-3 rounded-2xl border border-[#C6A87C]/20 flex items-center gap-3 shadow-sm">
          <Heart size={20} className="text-[#C6A87C] fill-[#C6A87C]" />
          <span className="font-black text-[#C6A87C] text-lg">{favorites.length}</span>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-20 text-center">
          <div className="w-24 h-24 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-gray-100 shadow-inner">
            <Heart size={48} className="text-gray-200" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3 uppercase tracking-tight">Coup de foudre à venir ?</h2>
          <p className="text-gray-400 mb-10 max-w-sm mx-auto font-medium">
            Explorez nos perles hôtelières et cliquez sur le cœur pour les ajouter à votre liste de favoris personnelle.
          </p>
          <Link 
            to="/hotels" 
            className="inline-flex items-center gap-3 bg-[#6B5434] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg hover:shadow-2xl active:scale-95"
          >
            Découvrir les hôtels
            <ArrowRight size={20} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {favorites.map(fav => (
            <HotelCard key={fav.hotelId} hotel={fav.hotel} />
          ))}
        </div>
      )}
    </div>
  );
}
