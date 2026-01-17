import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { hotels } from "../data/mockData";
import { BookingModal } from '../components/booking/BookingModal';
import { MessageSquare, Calendar as CalendarIcon } from 'lucide-react';
import { useMessages } from '../context/MessageContext';
import { useAuth } from '../context/AuthContext';
import { AvailabilityCalendar } from '../components/common/AvailabilityCalendar';
import toast from 'react-hot-toast';

export default function RoomDetailsPage() {
  const navigate = useNavigate();
  const { hotelId, roomId } = useParams<{ hotelId: string; roomId: string }>();
  const { setActiveConversation, conversations } = useMessages();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Find the hotel and then the room
  const hotel = hotels.find((h) => h.id.toString() === hotelId);
  const room = hotel?.rooms.find((r) => r.id.toString() === roomId);

  const handleContactOwner = () => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour contacter le propriétaire');
      navigate('/login', { state: { from: location } });
      return;
    }

    // Find if conversation already exists or start a new one
    const ownerId = 'owner-1'; // Mock owner ID linked to the hotel
    const existingConv = conversations.find(c => c.participants.some(p => p.id === ownerId));
    
    if (existingConv) {
      setActiveConversation(existingConv);
    } else {
      // In a real app, this would be an API call to create conversation
      setActiveConversation({
        id: `conv-${Date.now()}`,
        participants: [
          { id: user!.id, name: user!.name, role: 'USER' },
          { id: ownerId, name: hotel?.name || 'Propriétaire', role: 'OWNER' }
        ],
        unreadCount: 0
      });
    }
    
    toast.success('Chat ouvert avec le propriétaire');
  };

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
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-[#6B5434] hover:text-[#5B4424] mb-4 font-medium transition-colors"
        >
          <span className="mr-2">←</span> Retour
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Bienvenue sur {hotel.name} - Chambre {room.type}</h1>
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

            <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 mb-4">
                <CalendarIcon className="text-[#C6A87C]" size={20} />
                <h2 className="text-xl font-bold dark:text-white">Vérifier les disponibilités</h2>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Consultez le calendrier ci-dessous pour voir les dates libres pour cette chambre.
              </p>
              <AvailabilityCalendar roomId={room.id} />
            </div>

            <div className="flex justify-between items-center border-t dark:border-gray-800 pt-8">
              <div>
                <p className="text-gray-600">Capacité: {room.capacity} Personnes</p>
                <p className={`font-semibold ${room.available ? 'text-green-600' : 'text-red-600'}`}>
                  {room.available ? 'Disponible maintenant' : 'Actuellement indisponible'}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={handleContactOwner}
                  className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#6B5434] text-[#6B5434] hover:bg-[#6B5434] hover:text-white rounded-md font-bold transition-all"
                >
                  <MessageSquare size={18} />
                  Question au propriétaire
                </button>
                <BookingModal room={room} hotelName={hotel.name} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
