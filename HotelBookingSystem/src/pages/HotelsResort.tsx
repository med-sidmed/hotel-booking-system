import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import type { Hotel } from "../types";
import { hotels } from "../data/mockData";
import { useNavigate, useSearchParams } from "react-router-dom";

// Composant SearchBar
// Composant SearchBar
function SearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
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
            placeholder="Check-in"
            value={filters.checkIn}
            onChange={(e) => setFilters({...filters, checkIn: e.target.value})}
          />

          <input
            type="date"
            className="bg-white/90 text-gray-700 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Check-out"
            value={filters.checkOut}
            onChange={(e) => setFilters({...filters, checkOut: e.target.value})}
          />

          <select 
            className="bg-white/90 text-gray-700 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={filters.rooms}
            onChange={(e) => setFilters({...filters, rooms: e.target.value})}
          >
            <option value="">Rooms</option>
            <option value="1">1 Room</option>
            <option value="2">2 Rooms</option>
            <option value="3">3+ Rooms</option>
          </select>

          <button 
            onClick={handleSearch}
            className="bg-[#6B5434] hover:bg-[#5B4424] text-white font-semibold px-6 py-3 rounded-md transition-colors"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

interface HotelCardProps {
  hotel: Hotel;
}

// Composant HotelCard
function HotelCard({ hotel }: HotelCardProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3">
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-64 md:h-full object-cover"
          />
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
                ({hotel.reviews || 0} reviews)
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
            <span className="text-sm font-medium">{hotel.rooms.length} Rooms Available</span>
            <button 
              onClick={() => navigate(`/hotels/${hotel.id}`)}
              className="bg-[#6B5434] hover:bg-[#5B4424] text-white px-6 py-2 rounded-md text-sm font-semibold transition-colors"
            >
              See Rooms
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant principal
export default function HotelListingPage() {
  const [searchParams] = useSearchParams();
  const destination = searchParams.get('destination')?.toLowerCase() || '';

  const filteredHotels = hotels.filter(hotel => {
    if (!destination) return true;
    return hotel.location?.toLowerCase().includes(destination) || 
           hotel.name.toLowerCase().includes(destination);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header/>
      {/* Search Bar */}
      <SearchBar />

      {/* Hotels List */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Discover Our Hotels
          </h1>
          <p className="text-gray-600">
            Explore {filteredHotels.length} luxury destinations worldwide
          </p>
        </div>

        {filteredHotels.length > 0 ? (
          <div className="space-y-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        ) : (
           <div className="text-center py-12">
            <h3 className="text-xl text-gray-600">No hotels found matching your criteria.</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search filters.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
