import { useState, useEffect } from 'react';
import { hotelService } from '../../api/hotel.service';
import type { Review } from '../../types';
import { Star, MessageCircle, Home, CheckCircle2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MyReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMyReviews = async () => {
    try {
      const data = await hotelService.getMyReviews();
      setReviews(data);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
      toast.error('Erreur lors du chargement de vos avis');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReviews();
  }, []);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, idx) => (
      <Star
        key={idx}
        size={14}
        className={idx < rating ? 'text-[#C6A87C] fill-[#C6A87C]' : 'text-gray-200'}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#6B5434] mb-4" />
        <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Chargement de vos expériences...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Mes Expériences</h1>
        <p className="text-gray-500 text-sm mt-1 font-medium italic">Partagez vos moments, aidez la communauté à mieux choisir</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 shadow-inner group-hover:scale-110 transition-transform">
                    {review.user_avatar || review.userAvatar ? (
                      <img 
                        src={review.user_avatar || review.userAvatar} 
                        alt="User Avatar"
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    ) : (
                        <div className="text-[#C6A87C] font-black text-xl">
                            {(review.user_name || review.userName || 'U')[0]}
                        </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                        <Home className="text-[#C6A87C]" size={14} />
                        <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs">
                          {review.hotel_name || 'Établissement'}
                        </h3>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex items-center gap-0.5">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">
                        Publié le {review.date || String(review.created_at).split('T')[0]}
                      </span>
                    </div>
                  </div>
                </div>
                {review.verified && (
                  <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                    <CheckCircle2 size={12} />
                    Séjour Vérifié
                  </span>
                )}
              </div>

              <div className="bg-gray-50/50 rounded-2xl p-6 mb-6 border border-gray-100 group-hover:bg-white group-hover:border-[#C6A87C]/20 transition-all">
                <p className="text-gray-600 leading-relaxed font-medium">"{review.comment}"</p>
              </div>

              {review.photos && review.photos.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-6">
                  {review.photos.map((photo, idx) => (
                    <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden shadow-md hover:scale-105 transition-transform">
                        <img
                          src={photo}
                          alt="Review photo"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors"></div>
                    </div>
                  ))}
                </div>
              )}

              {review.owner_response && (
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <div className="flex gap-4 items-start bg-[#FBF9F6] p-6 rounded-2xl border border-[#EBE3D5]">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                        <MessageCircle className="text-[#C6A87C]" size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-[#6B5434] uppercase tracking-widest mb-2">Réponse de la Direction</p>
                        <p className="text-sm text-gray-600 leading-relaxed italic">
                          "{typeof review.owner_response === 'string' ? review.owner_response : review.owner_response.text}"
                        </p>
                        <p className="text-[9px] font-bold text-gray-400 mt-3 uppercase tracking-tighter">
                             Répondu le {typeof review.owner_response === 'object' ? String(review.owner_response.created_at).split('T')[0] : 'récemment'}
                        </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <MessageCircle className="mx-auto text-gray-200 mb-4" size={48} />
          <p className="text-gray-400 font-black uppercase tracking-widest text-sm">Silence radio</p>
          <p className="text-gray-300 text-xs mt-2 font-medium">Vous n'avez pas encore partagé d'avis sur vos séjours.</p>
        </div>
      )}
    </div>
  );
}
