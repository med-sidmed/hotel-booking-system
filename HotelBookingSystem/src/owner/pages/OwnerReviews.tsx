import { useState, useEffect } from 'react';
import { 
  Star, 
  Search, 
  MessageSquare, 
  Send,
  User,
  AlertCircle,
  Building2
} from 'lucide-react';
import { useReviews } from '../../context/ReviewsContext';
import { hotelService } from '../../api/hotel.service';
import type { Review, Hotel } from '../../types';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function OwnerReviews() {
  const { getReviewsByHotelId, replyToReview, fetchReviewsForHotel } = useReviews();
  const [searchTerm, setSearchTerm] = useState('');
  const [replyText, setReplyText] = useState<{ [key: string | number]: string }>({});
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotelId, setSelectedHotelId] = useState<string | number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await hotelService.getOwnerHotels();
        setHotels(data);
        if (data.length > 0) {
          setSelectedHotelId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch hotels:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHotels();
  }, []);

  useEffect(() => {
    if (selectedHotelId) {
      fetchReviewsForHotel(selectedHotelId);
    }
  }, [selectedHotelId]);

  const hotelReviews = selectedHotelId ? getReviewsByHotelId(selectedHotelId) : [];

  const filteredReviews = hotelReviews.filter(review => 
    review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReply = async (reviewId: string | number) => {
    const text = replyText[reviewId];
    if (!text?.trim() || !selectedHotelId) {
      toast.error('Veuillez saisir une réponse');
      return;
    }
    
    try {
      await replyToReview(selectedHotelId, reviewId, text);
      toast.success('Réponse envoyée avec succès');
      setReplyText({ ...replyText, [reviewId]: '' });
    } catch (err) {
      toast.error('Erreur lors de l\'envoi de la réponse');
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Gestion des Avis</h1>
          <p className="text-gray-500 dark:text-gray-400">Répondez aux commentaires de vos clients</p>
        </div>
        
        {hotels.length > 1 && (
          <div className="flex items-center gap-2 bg-white dark:bg-[#1A1A1A] p-2 rounded-lg border dark:border-gray-800 shadow-sm">
            <Building2 size={18} className="text-[#C6A87C]" />
            <select 
              value={selectedHotelId || ''} 
              onChange={(e) => setSelectedHotelId(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm font-bold dark:text-white outline-none"
            >
              {hotels.map(hotel => (
                <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-[#1A1A1A] p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Note Moyenne</p>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold dark:text-white">
              {(hotelReviews.reduce((acc, r) => acc + r.rating, 0) / hotelReviews.length || 0).toFixed(1)}
            </h2>
            <div className="flex text-amber-400">
              <Star size={20} fill="currentColor" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#1A1A1A] p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Avis</p>
          <h2 className="text-2xl font-bold dark:text-white">{hotelReviews.length}</h2>
        </div>
        <div className="bg-white dark:bg-[#1A1A1A] p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Sans Réponse</p>
          <h2 className="text-2xl font-bold text-amber-500 underline">
            {hotelReviews.filter(r => !r.ownerResponse).length}
          </h2>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-[#1A1A1A] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher par client ou contenu..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg focus:ring-2 focus:ring-[#C6A87C] dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-6">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#1A1A1A] rounded-xl border border-dashed dark:border-gray-800">
            <MessageSquare className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 dark:text-gray-400 font-medium">Aucun avis trouvé.</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="bg-white dark:bg-[#1A1A1A] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400">
                  <User size={24} />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold dark:text-white">{review.userName}</h3>
                      <p className="text-xs text-gray-400">{review.date}</p>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 italic">"{review.comment}"</p>

                  {review.ownerResponse ? (
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border-l-4 border-[#C6A87C]">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs font-bold text-[#C6A87C]">VOTRE RÉPONSE ({review.ownerResponse.date})</p>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{review.ownerResponse.text}"</p>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <div className="flex gap-2">
                        <textarea
                          placeholder="Écrivez votre réponse ici..."
                          className="flex-grow p-3 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-[#C6A87C] outline-none dark:text-white h-20 resize-none"
                          value={replyText[review.id] || ''}
                          onChange={(e) => setReplyText({ ...replyText, [review.id]: e.target.value })}
                        />
                        <button 
                          onClick={() => handleReply(review.id)}
                          className="px-4 bg-[#C6A87C] hover:bg-[#B5966A] text-white rounded-lg transition-colors flex items-center justify-center"
                        >
                          <Send size={18} />
                        </button>
                      </div>
                      <div className="flex items-center gap-1 mt-2 text-amber-500">
                        <AlertCircle size={12} />
                        <span className="text-[10px]">Votre réponse sera visible par tous les futurs clients.</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
