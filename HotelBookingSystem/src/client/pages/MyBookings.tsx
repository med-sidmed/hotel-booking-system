import { useState, useEffect } from 'react';
import { bookingService } from '../../api/booking.service';
import type { Booking } from '../../types';
import { Download, Calendar, MapPin, TrendingUp, CheckCircle, Clock, XCircle, Star } from 'lucide-react';
import { useReviews } from '../../context/ReviewsContext';
import toast from 'react-hot-toast';

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('ALL');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { addReview } = useReviews();
  
  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const data = await bookingService.getBookings();
      setBookings(data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError('Impossible de récupérer vos réservations.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSubmitReview = async () => {
    if (!selectedBooking || !comment.trim()) return;
    setIsSubmitting(true);
    try {
      await addReview(selectedBooking.id, rating, comment);
      toast.success('Merci pour votre avis !');
      setShowReviewModal(false);
      setComment('');
      setRating(5);
    } catch (err) {
      toast.error('Erreur lors de l\'envoi de l\'avis');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredBookings = bookings.filter(b => 
    filter === 'ALL' || b.status === filter
  );

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
    pending: bookings.filter(b => b.status === 'PENDING').length,
    cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
    totalSpent: bookings
      .filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
      .reduce((acc: number, curr: any) => acc + (curr.totalPrice || 0), 0)
  };

  if (isLoading) return <div className="text-center py-12">Chargement de vos réservations...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Mes Réservations</h1>
        <p className="text-gray-500 text-sm mt-1">Gérez et consultez vos réservations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Calendar className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Confirmées</p>
              <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">En Attente</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Dépensé</p>
              <p className="text-2xl font-bold text-[#C6A87C]">{stats.totalSpent}</p>
              <p className="text-xs text-gray-400">MRU</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <TrendingUp className="text-[#C6A87C]" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
          {['ALL', 'CONFIRMED', 'PENDING', 'CANCELLED'].map((s) => (
            <button 
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                filter === s 
                  ? (s === 'CONFIRMED' ? 'bg-green-600 text-white shadow-sm' : 
                     s === 'PENDING' ? 'bg-yellow-500 text-white shadow-sm' :
                     s === 'CANCELLED' ? 'bg-red-500 text-white shadow-sm' :
                     'bg-[#C6A87C] text-white shadow-sm')
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {s === 'ALL' ? 'Tout' : s === 'CONFIRMED' ? 'Confirmé' : s === 'PENDING' ? 'En Attente' : 'Annulé'}
            </button>
          ))}
        </div>
        
        <div className="text-sm text-gray-500">
          {filteredBookings.length} résultat{filteredBookings.length > 1 ? 's' : ''}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredBookings.map((booking: any) => (
          <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all hover:border-[#C6A87C]/30">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-bold text-gray-800">{booking.room_type_name || "Chambre"}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                    booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                    booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    booking.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {booking.status === 'CONFIRMED' && <CheckCircle size={14} />}
                    {booking.status === 'PENDING' && <Clock size={14} />}
                    {booking.status === 'CANCELLED' && <XCircle size={14} />}
                    {booking.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin size={16} className="mr-2 text-gray-400" />
                    <span>{booking.hotel_name || "Hôtel Luxotel"}</span>
                  </div>

                  <div className="flex items-center text-gray-600 text-sm">
                    <Calendar size={16} className="mr-2 text-gray-400" />
                    <span className="font-medium">{booking.checkIn || booking.check_in}</span>
                    <span className="mx-2">→</span>
                    <span className="font-medium">{booking.checkOut || booking.check_out}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Prix Total</p>
                    <p className="text-xl font-bold text-[#C6A87C]">{booking.totalPrice || booking.total_price} MRU</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date Réservation</p>
                    <p className="text-sm font-medium text-gray-700">{booking.created_at ? new Date(booking.created_at).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Référence</p>
                    <p className="text-sm font-mono text-gray-400">{booking.id.toString().slice(0, 8)}...</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 ml-6">
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
                  <Download size={16} />
                  Facture
                </button>
                {booking.status === 'COMPLETED' ? (
                  <button 
                    onClick={() => {
                      setSelectedBooking(booking);
                      setShowReviewModal(true);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm"
                  >
                    <Star size={16} />
                    Laisser un avis
                  </button>
                ) : booking.status === 'CONFIRMED' ? (
                  <button 
                    disabled
                    title="Vous pourrez laisser un avis une fois le séjour terminé"
                    className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg font-medium text-sm flex items-center gap-2 cursor-not-allowed border border-gray-200"
                  >
                    <Star size={16} />
                    Laisser un avis
                  </button>
                ) : null}
                {booking.status === 'CONFIRMED' && (
                  <button 
                    onClick={async () => {
                      if (window.confirm('Voulez-vous vraiment annuler cette réservation ?')) {
                        try {
                          await bookingService.cancelBooking(booking.id);
                          toast.success('Réservation annulée');
                          fetchBookings();
                        } catch (err) {
                          toast.error('Erreur lors de l\'annulation');
                        }
                      }
                    }}
                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium text-sm transition-colors border border-red-200"
                  >
                    Annuler
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Calendar className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune réservation trouvée</h3>
          <p className="text-gray-500 mb-6">
            Vous n'avez pas de réservation correspondant à ce filtre.
          </p>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Laisser un avis</h3>
            <p className="text-sm text-gray-500 mb-6">
              Comment s'est passé votre séjour au {selectedBooking?.hotel_name || selectedBooking?.hotelName} ?
            </p>

            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <p className="text-sm font-medium text-gray-700 mb-2">Votre note</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={32}
                        className={star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Votre commentaire</p>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Partagez votre expérience..."
                  className="w-full h-32 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C6A87C] outline-none resize-none text-sm"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors"
                >
                  Annuler
                </button>
                <button
                  disabled={!comment.trim() || isSubmitting}
                  onClick={handleSubmitReview}
                  className="flex-1 px-4 py-2 bg-[#C6A87C] hover:bg-[#B5966A] text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Envoi...' : 'Envoyer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
