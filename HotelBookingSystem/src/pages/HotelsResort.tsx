import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useSearchParams } from "react-router-dom";
import { hotelService } from "../api/hotel.service";
import type { Hotel } from "../types";
import { HotelCard } from "../components/HotelCard";

// Composant SearchBar
function SearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    destination: searchParams.get('destination') || '',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    rooms: searchParams.get('rooms') || ''
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.destination) params.set('destination', filters.destination);
    if (filters.checkIn) params.set('checkIn', filters.checkIn);
    if (filters.checkOut) params.set('checkOut', filters.checkOut);
    if (filters.rooms) params.set('rooms', filters.rooms);
    
    setSearchParams(params);
  };

  return (
    <div className="bg-[#8B7355] py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <input 
            type="text"
            placeholder="Destination"
            className="bg-white/90 text-gray-700 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={filters.destination}
            onChange={(e) => setFilters({...filters, destination: e.target.value})}
          />

          <input
            type="date"
            className="bg-white/90 text-gray-700 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Arrivée"
            value={filters.checkIn}
            onChange={(e) => setFilters({...filters, checkIn: e.target.value})}
          />

          <input
            type="date"
            className="bg-white/90 text-gray-700 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Départ"
            value={filters.checkOut}
            onChange={(e) => setFilters({...filters, checkOut: e.target.value})}
          />

          <select 
            className="bg-white/90 text-gray-700 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={filters.rooms}
            onChange={(e) => setFilters({...filters, rooms: e.target.value})}
          >
            <option value="">Chambres</option>
            <option value="1">1 Chambre</option>
            <option value="2">2 Chambres</option>
            <option value="3">3+ Chambres</option>
          </select>

          <button 
            onClick={handleSearch}
            className="bg-[#6B5434] hover:bg-[#5B4424] text-white font-semibold px-6 py-3 rounded-md transition-colors"
          >
            Rechercher
          </button>
        </div>
      </div>
    </div>
  );
}

// Composant principal
export default function HotelListingPage() {
  const [searchParams] = useSearchParams();
  const [hotelsList, setHotelsList] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const destination = searchParams.get('destination') || '';

  useEffect(() => {
    const fetchHotels = async () => {
      setIsLoading(true);
      try {
        const data = await hotelService.getHotels({ city: destination });
        setHotelsList(data);
      } catch (err) {
        console.error('Failed to fetch hotels:', err);
        setError('Impossible de charger les hôtels.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHotels();
  }, [destination]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header/>
      <SearchBar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Découvrez nos hôtels
          </h1>
          <p className="text-gray-600">
            Explorez {hotelsList.length} destinations de luxe disponible
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12"><p>Chargement des hôtels...</p></div>
        ) : error ? (
          <div className="text-center py-12"><p className="text-red-500">{error}</p></div>
        ) : hotelsList.length > 0 ? (
          <div className="space-y-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {hotelsList.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        ) : (
           <div className="text-center py-12">
            <h3 className="text-xl text-gray-600">Aucun hôtel trouvé correspondant à vos critères.</h3>
            <p className="text-gray-500 mt-2">Essayez d'ajuster vos filtres de recherche.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
