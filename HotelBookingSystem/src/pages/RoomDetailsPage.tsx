import { useNavigate, useParams } from 'react-router-dom';
import { hotels } from "../data/mockData";
import { BookingModal } from '../components/booking/BookingModal';

export default function RoomDetailsPage() {
  const navigate = useNavigate();
  const { hotelId, roomId } = useParams<{ hotelId: string; roomId: string }>();

  // Find the hotel and then the room
  const hotel = hotels.find((h) => h.id.toString() === hotelId);
  const room = hotel?.rooms.find((r) => r.id.toString() === roomId);

  if (!hotel || !room) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
         <div className="flex-grow flex items-center justify-center space-x-4 flex-col">
                  <button className="bg-[#6B5434] hover:bg-[#5B4424] text-white px-8 py-3 rounded-md font-bold transition-colors" onClick={() => navigate("/")}>Retour à la page d'accueil</button>
          <h2 className="text-2xl font-bold text-gray-800">Chambre introuvable</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 px-4 pt-8 max-w-7xl mx-auto">Bienvenue sur {hotel.name} - Chambre {room.type}</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-96">
            <img 
              src={room.images[0]} 
              alt={room.type} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-full font-bold text-gray-900 shadow">
              {room.price}€ / nuit
            </div>
          </div>
          
          <div className="p-8">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <h1 className="text-3xl font-bold text-gray-900">{room.type}</h1>
                  <p className="text-gray-500 mt-1">à {hotel.name}</p>
               </div>
            </div>
            
            {/* Image Gallery */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {room.images.map((img, idx) => (
                <img key={idx} src={img} alt={`Vue de la chambre ${idx + 1}`} className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity" />
              ))}
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Équipements</h2>
              <div className="flex flex-wrap gap-2">
                {room.amenities?.map((amenity, index) => (
                  <span 
                    key={index}
                    className="bg-[#F0E6D2] text-[#6B5434] px-3 py-1 rounded-full text-sm"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center border-t pt-8">
              <div>
                <p className="text-gray-600">Capacité: {room.capacity} Personnes</p>
                <p className={`font-semibold ${room.available ? 'text-green-600' : 'text-red-600'}`}>
                  {room.available ? 'Disponible maintenant' : 'Actuellement indisponible'}
                </p>
              </div>
              
              <BookingModal room={room} hotelName={hotel.name} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


