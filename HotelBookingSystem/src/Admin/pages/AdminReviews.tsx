import { useState, useEffect } from 'react';
import { 
  Star, 
  Search, 
  Flag, 
  Trash2, 
  CheckCircle, 
  AlertTriangle,
  MessageSquare,
  Hotel as HotelIcon
} from 'lucide-react';
import { useReviews } from '../../context/ReviewsContext';
import type { Review } from '../../context/ReviewsContext';
import { hotelService } from '../../api/hotel.service';
import type { Hotel } from '../../types';
import toast from 'react-hot-toast';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export default function AdminReviews() {
  const { getAllReviews, moderateReview } = useReviews();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'flagged' | 'visible' | 'hidden'>('all');
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [confirmAction, setConfirmAction] = useState<{
    show: boolean;
    review?: Review;
    action: 'flag' | 'delete' | 'approve';
  }>({ show: false, action: 'approve' });

  useEffect(() => {
    const fetchHotels = async () => {
        try {
            const data = await hotelService.getHotels();
            setHotels(data);
        } catch (err) {
            console.error('Failed to fetch hotels for reviews mapping:', err);
        }
    };
    fetchHotels();
  }, []);

  const allReviews = getAllReviews();

  const filteredReviews = allReviews.filter(review => {
    const matchesSearch = 
      review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || review.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getHotelName = (hotelId: number) => {
    return hotels.find(h => h.id === hotelId)?.name || `Hôtel #${hotelId}`;
  };

  const handleModerate = () => {
    if (!confirmAction.review) return;
    
    moderateReview(
      confirmAction.review.hotelId, 
      confirmAction.review.id, 
      confirmAction.action
    );
    
    const messages = {
      flag: 'Avis signalé',
      delete: 'Avis supprimé (masqué)',
      approve: 'Avis approuvé'
    };
    
    toast.success(messages[confirmAction.action]);
    setConfirmAction({ show: false, action: 'approve' });
  };

  const statusIcons = {
    visible: <CheckCircle className="text-green-500" size={16} />,
    flagged: <AlertTriangle className="text-amber-500" size={16} />,
    hidden: <Trash2 className="text-red-500" size={16} />
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Modération des Avis</h1>
          <p className="text-gray-500 dark:text-gray-400">Gérez les commentaires et assurez la qualité du contenu</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-[#1A1A1A] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher un utilisateur ou un commentaire..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg focus:ring-2 focus:ring-[#C6A87C] dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'visible', 'flagged', 'hidden'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterStatus === status 
                  ? 'bg-[#C6A87C] text-white shadow-md' 
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="capitalize">{status === 'all' ? 'Tous' : status === 'visible' ? 'Visibles' : status === 'flagged' ? 'Signalés' : 'Supprimés'}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#1A1A1A] rounded-xl border border-dashed dark:border-gray-800">
            <MessageSquare className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 dark:text-gray-400 font-medium">Aucun avis ne correspond à vos critères.</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className={`bg-white dark:bg-[#1A1A1A] p-6 rounded-xl shadow-sm border ${
              review.status === 'flagged' ? 'border-amber-200 dark:border-amber-900/50 bg-amber-50/30' : 'border-gray-100 dark:border-gray-800'
            }`}>
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#C6A87C]/10 rounded-full flex items-center justify-center text-[#C6A87C] font-bold shrink-0">
                    {review.userName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold dark:text-white">{review.userName}</h3>
                      <span className="text-xs text-gray-400">• {review.date}</span>
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-50 dark:bg-gray-800 text-[10px] text-gray-500 font-medium">
                        {statusIcons[review.status]}
                        <span className="capitalize">{review.status}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <HotelIcon size={12} />
                        {getHotelName(review.hotelId)}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 italic mb-4">"{review.comment}"</p>
                    
                    {review.ownerResponse && (
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border-l-4 border-[#C6A87C]">
                        <p className="text-xs font-bold text-[#C6A87C] mb-1">RÉPONSE DU PROPRIÉTAIRE</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{review.ownerResponse.text}"</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex md:flex-col gap-2 shrink-0">
                  {review.status !== 'visible' && (
                    <button 
                      onClick={() => setConfirmAction({ show: true, review, action: 'approve' })}
                      className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                      title="Approuver"
                    >
                      <CheckCircle size={18} />
                      <span className="md:hidden">Approuver</span>
                    </button>
                  )}
                  {review.status !== 'flagged' && (
                    <button 
                      onClick={() => setConfirmAction({ show: true, review, action: 'flag' })}
                      className="p-2 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                      title="Signaler"
                    >
                      <Flag size={18} />
                      <span className="md:hidden">Signaler</span>
                    </button>
                  )}
                  {review.status !== 'hidden' && (
                    <button 
                      onClick={() => setConfirmAction({ show: true, review, action: 'delete' })}
                      className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                      title="Masquer"
                    >
                      <Trash2 size={18} />
                      <span className="md:hidden">Masquer</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmAction.show}
        onClose={() => setConfirmAction({ ...confirmAction, show: false })}
        onConfirm={handleModerate}
        title={`${confirmAction.action === 'flag' ? 'Signaler' : confirmAction.action === 'delete' ? 'Masquer' : 'Approuver'} l'avis`}
        message={`Êtes-vous sûr de vouloir ${confirmAction.action === 'flag' ? 'signaler' : confirmAction.action === 'delete' ? 'masquer' : 'approuver'} cet avis ?`}
        type={confirmAction.action === 'delete' ? 'danger' : 'warning'}
      />
    </div>
  );
}
