/* import { useParams } from 'react-router-dom'; */ // Uncomment
import Header from "../components/Header";
 import type { Room } from '../types';

export default function RoomDetailsPage() {
  /* const { id } = useParams<{ id: string }>(); */
  
  // Mock data for a single room
  const room: Room = {
    id: 1,
    hotelId: 1,
    type: "Deluxe Suite",
    price: 250,
    capacity: 2,
    amenities: ["WiFi", "Jacuzzi", "Ocean View", "King Bed"],
    image: "https://images.unsplash.com/photo-1590490360182-f33d5e6a385c?w=800&h=600&fit=crop",
    available: true
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header/>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-96">
            <img 
              src={room.image} 
              alt={room.type} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-full font-bold text-gray-900 shadow">
              ${room.price} / night
            </div>
          </div>
          
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{room.type}</h1>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {room.amenities.map((amenity, index) => (
                  <span 
                    key={index}
                    className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center border-t pt-8">
              <div>
                <p className="text-gray-600">Capacity: {room.capacity} Guests</p>
                <p className={`font-semibold ${room.available ? 'text-green-600' : 'text-red-600'}`}>
                  {room.available ? 'Available Now' : 'Currently Unavailable'}
                </p>
              </div>
              
              <button 
                className="bg-[#6B5434] hover:bg-[#5B4424] text-white px-8 py-3 rounded-md font-bold transition-colors"
                disabled={!room.available}
              >
                Book This Room
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
