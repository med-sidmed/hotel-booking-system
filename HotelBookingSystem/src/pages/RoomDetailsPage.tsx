import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { hotelService } from "../api/hotel.service";
import { BookingModal } from '../components/booking/BookingModal';
import { MessageSquare, Calendar as CalendarIcon, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { useMessages } from '../context/MessageContext';
import { useAuth } from '../context/AuthContext';
import { AvailabilityCalendar } from '../components/common/AvailabilityCalendar';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import type { Hotel, Room } from '../types';

export default function RoomDetailsPage() {
  const navigate = useNavigate();
  const { hotelId, roomId } = useParams<{ hotelId: string; roomId: string }>();
  const { setActiveConversation, conversations } = useMessages();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  const [selectedImageIdx, setSelectedImageIdx] = useState<number | null>(null);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!hotelId || !roomId) return;
      setIsLoading(true);
      try {
        const [hotelData, roomsData] = await Promise.all([
          hotelService.getHotel(hotelId),
          hotelService.getRooms(hotelId)
        ]);
        setHotel(hotelData);
        const targetRoom = roomsData.find(r => r.id.toString() === roomId);
        setRoom(targetRoom || null);
      } catch (err) {
        console.error('Failed to fetch room details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoomData();
  }, [hotelId, roomId]);

  const handleContactOwner = () => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour contacter l\'établissement');
      navigate('/login', { state: { from: location } });
      return;
    }

    if (!hotel) return;

    const ownerId = hotel.owner; 
    const existingConv = conversations.find(c => 
      c.participants.some(p => p.id === ownerId) && c.hotelId === hotel.id
    );
    
    if (existingConv) {
      setActiveConversation(existingConv);
      navigate('/profile/messages');
    } else {
      // For new conversations, we'll navigate to messages and let the context handle creation on first send
      // Or we can pre-set a "pending" conversation style
      navigate('/profile/messages', { 
        state: { 
          startWith: {
            id: ownerId,
            name: hotel.name,
            hotelId: hotel.id
          }
        } 
      });
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  if (!hotel || !room) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
         <div className="flex-grow flex items-center justify-center space-x-4 flex-col">
                  <button className="bg-[#6B5434] hover:bg-[#5B4424] text-white px-8 py-3 rounded-md font-bold transition-colors mb-4" onClick={() => navigate("/")}>Retour à la page d'accueil</button>
          <h2 className="text-2xl font-bold text-gray-800">Chambre introuvable</h2>
        </div>
      </div>
    );
  }

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIdx !== null) {
      setSelectedImageIdx((selectedImageIdx + 1) % (room.images?.length || 1));
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIdx !== null) {
      setSelectedImageIdx((selectedImageIdx - 1 + (room.images?.length || 1)) % (room.images?.length || 1));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-[#6B5434] hover:text-[#5B4424] mb-4 font-bold transition-transform hover:-translate-x-1"
        >
          <ChevronLeft size={20} /> Retour
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-white dark:bg-[#1A1A1A] rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
          {/* Hero Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[500px] p-2">
            <div 
              className="md:col-span-2 h-full relative cursor-pointer group overflow-hidden rounded-2xl"
              onClick={() => setSelectedImageIdx(0)}
            >
              <img src={room.images?.[0] || 'https://via.placeholder.com/800x600'} alt={room.type} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute bottom-6 left-6 text-white bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl font-black shadow-lg">
                {room.price}€ / nuit
              </div>
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-md p-3 rounded-full text-white">
                <Maximize2 size={24} />
              </div>
            </div>
            <div className="md:col-span-2 grid grid-cols-2 gap-2 h-full">
              {room.images?.slice(1, 5).map((img, idx) => (
                <div 
                  key={idx} 
                  className="relative cursor-pointer group overflow-hidden rounded-2xl"
                  onClick={() => setSelectedImageIdx(idx + 1)}
                >
                  <img src={img} alt={`Room detail ${idx + 2}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                  {idx === 3 && room.images.length > 5 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-black text-xl">
                      +{room.images.length - 5} photos
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
               <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-[#C6A87C]/10 text-[#C6A87C] px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest leading-none">
                      {room.available ? 'Disponible' : 'Indisponible'}
                    </span>
                    <span className="text-gray-400 font-bold text-sm">• {room.capacity} Personnes Max</span>
                  </div>
                  <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white mb-2">{room.type}</h1>
                  <p className="text-xl font-bold text-[#C6A87C]">{hotel.name}</p>
                  
                  <div className="mt-8">
                    <h2 className="text-xl font-black mb-4 dark:text-white">À propos de cette chambre</h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
                      Une expérience de luxe redéfinie. Cette chambre offre un confort inégalé avec des finitions haut de gamme, 
                      une vue imprenable et des équipements de pointe pour un séjour mémorable à {hotel.location}.
                    </p>
                  </div>

                  <div className="mt-10">
                    <h2 className="text-xl font-black mb-6 dark:text-white">Équipements inclus</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {room.amenities?.map((amenity, index) => (
                        <div 
                          key={index}
                          className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#C6A87C]" />
                          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
               </div>

               <div className="w-full md:w-96 flex flex-col gap-6">
                  <div className="p-6 bg-[#6B5434] rounded-3xl text-white shadow-xl shadow-[#6B5434]/20">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-4xl font-black">{room.price}€</span>
                      <span className="opacity-80 font-bold uppercase tracking-widest text-xs">Par nuit</span>
                    </div>
                    <BookingModal room={room} hotelName={hotel.name} />
                  </div>

                  <div className="p-6 bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <h3 className="font-black mb-2 dark:text-white">Besoin d'aide ?</h3>
                    <p className="text-sm text-gray-500 mb-6">Notre équipe est disponible 24/7 pour répondre à vos questions sur {hotel.name}.</p>
                    <button 
                      onClick={handleContactOwner}
                      className="w-full flex items-center justify-center gap-3 py-4 bg-white dark:bg-gray-700 text-[#6B5434] dark:text-[#C6A87C] border-2 border-[#6B5434] dark:border-[#C6A87C] rounded-2xl font-black hover:bg-[#6B5434] dark:hover:bg-[#C6A87C] hover:text-white transition-all shadow-lg hover:shadow-[#6B5434]/30"
                    >
                      <MessageSquare size={20} />
                      Contacter l'Hôtel
                    </button>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <BookingModal room={{...room, hotel_id: hotel.id}} hotelName={hotel.name} />
                    </div>
                  </div>
               </div>
            </div>

            <div className="mt-16 p-8 bg-gray-50 dark:bg-gray-800/30 rounded-[32px] border border-gray-100 dark:border-gray-800">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                  <h2 className="text-2xl font-black dark:text-white flex items-center gap-3">
                    <CalendarIcon className="text-[#C6A87C]" size={28} />
                    Disponibilités & Réservation
                  </h2>
                  <p className="text-gray-500 font-bold mt-1">Sélectionnez vos dates pour voir les disponibilités en temps réel</p>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                <AvailabilityCalendar roomId={room.id} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Immersive Lightbox */}
      <AnimatePresence>
        {selectedImageIdx !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12"
            onClick={() => setSelectedImageIdx(null)}
          >
            <button 
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-[110]"
              onClick={() => setSelectedImageIdx(null)}
            >
              <X size={40} strokeWidth={3} />
            </button>

            <button 
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-4 rounded-full transition-all z-[110]"
              onClick={prevImage}
            >
              <ChevronLeft size={40} />
            </button>

            <button 
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-4 rounded-full transition-all z-[110]"
              onClick={nextImage}
            >
              <ChevronRight size={40} />
            </button>

            <motion.div 
              key={selectedImageIdx}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative max-w-6xl w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={room.images?.[selectedImageIdx] || 'https://via.placeholder.com/800x600'} 
                alt="Room Full View" 
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl" 
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-6 py-2 rounded-full text-white font-black text-sm border border-white/10">
                {selectedImageIdx + 1} / {room.images?.length || 1}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
