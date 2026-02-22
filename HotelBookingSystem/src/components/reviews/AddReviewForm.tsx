import { useState, useEffect } from 'react';
import { useReviews } from "../../context/ReviewsContext";
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../api/booking.service';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

interface AddReviewFormProps {
  hotelId: string | number;
  onSuccess: () => void;
}

export function AddReviewForm({ hotelId, onSuccess }: AddReviewFormProps) {
  const { addReview } = useReviews();
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingBooking, setIsLoadingBooking] = useState(true);
  const [bookingId, setBookingId] = useState<string | number | null>(null);

  useEffect(() => {
    const findValidBooking = async () => {
      if (!user) {
        setIsLoadingBooking(false);
        return;
      }

      try {
        const bookings = await bookingService.getBookings();
        const validBooking = bookings.find(b => 
          (b.hotelId === hotelId || (b as any).hotel === hotelId) && 
          (b.status === 'COMPLETED' || b.status === 'CONFIRMED')
        );
        
        if (validBooking) {
          setBookingId(validBooking.id);
        }
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
      } finally {
        setIsLoadingBooking(false);
      }
    };

    findValidBooking();
  }, [hotelId, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId) {
      toast.error("Vous devez avoir une réservation confirmée ou terminée dans cet hôtel pour laisser un avis.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addReview(bookingId, rating, comment);
      toast.success("Merci ! Votre avis a été publié.");
      setComment("");
      setRating(5);
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Erreur lors de la publication de l'avis");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingBooking) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="animate-spin text-[#6B5434] mb-4" size={32} />
        <p className="text-gray-500 font-medium">Vérification de votre séjour...</p>
      </div>
    );
  }

  if (!bookingId) {
    return (
      <div className="p-8 text-center bg-amber-50 rounded-2xl border border-amber-100">
        <h3 className="text-lg font-bold text-amber-900 mb-2">Réservations introuvables</h3>
        <p className="text-amber-700 text-sm mb-6">
          Désolé, vous ne pouvez laisser un avis que si vous avez déjà séjourné dans cet établissement et que votre réservation est marquée comme terminée.
        </p>
        <button 
          onClick={onSuccess}
          className="px-6 py-2 bg-amber-200 text-amber-900 rounded-lg font-bold hover:bg-amber-300 transition-colors"
        >
          Compris
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center gap-4">
        <div className="w-12 h-12 bg-[#6B5434]/10 rounded-full flex items-center justify-center text-[#6B5434] font-black text-xl">
          {user?.name?.charAt(0) || "U"}
        </div>
        <div>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Avis de</p>
          <p className="text-lg font-black text-gray-900">{user?.name}</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-black text-gray-700 uppercase tracking-widest">Votre Note</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-3xl transition-all hover:scale-110 ${
                star <= rating ? 'text-yellow-400' : 'text-gray-200'
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-black text-gray-700 uppercase tracking-widest">Commentaire</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 outline-none focus:border-[#6B5434] transition-colors resize-none"
          placeholder="Décrivez votre séjour en quelques mots..."
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#6B5434] hover:bg-[#5B4424] text-white font-black py-4 rounded-2xl transition-all shadow-lg hover:shadow-[#6B5434]/30 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Publier mon avis"}
      </button>
    </form>
  );
}
