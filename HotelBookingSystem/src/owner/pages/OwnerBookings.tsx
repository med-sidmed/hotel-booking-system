import { useEffect, useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { bookingService } from '../../api/booking.service';
import type { Booking } from '../../types';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Calendar, Check, Search, User, X, Loader2, MessageSquare, CheckCircle } from 'lucide-react';
import { ConfirmDialog, FormDialog } from '@/components/Dialog';

export default function OwnerBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [pendingAction, setPendingAction] = useState<{ id: string | number; status: string } | null>(null);
  const { addNotification } = useNotifications();
  const navigate = useNavigate();


  const fetchBookings = async () => {
    try {
      const data = await bookingService.getOwnerBookings();
      setBookings(data);
    } catch (err) {
      console.error('Failed to fetch owner bookings:', err);
      toast.error('Erreur lors du chargement des réservations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    
    const interval = setInterval(() => {
      fetchBookings();
    }, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  const handleStatusChangeRequest = (id: string | number, newStatus: string) => {
    const booking = bookings.find(b => b.id === id);
    setPendingAction({ id, status: newStatus });
    setSelectedBooking(booking);
    setShowConfirmDialog(true);
  };

  const confirmStatusChange = async () => {
    if (pendingAction && selectedBooking) {
      try {
        const updatedBooking = await bookingService.updateBookingStatus(pendingAction.id, pendingAction.status);
        
        setBookings(bookings.map(b =>
          b.id === pendingAction.id ? updatedBooking : b
        ));
        
        const statusText = pendingAction.status === 'CONFIRMED' ? 'confirmée' : 'annulée';
        toast.success(`Réservation ${statusText} avec succès`);

        // Trigger notification for the client (In-app notification system mock)
        addNotification({
          userId: selectedBooking.user || 0,
          type: pendingAction.status === 'CONFIRMED' ? 'BOOKING_CONFIRMED' : 'BOOKING_CANCELLED',
          title: `Réservation ${pendingAction.status === 'CONFIRMED' ? 'Confirmée' : 'Annulée'}`,
          message: `Votre réservation pour "${selectedBooking.room_type_name}" a été ${statusText} par l'établissement.`,
          actionUrl: '/profile/bookings'
        });
      } catch (err) {
        console.error('Status update failed:', err);
        toast.error('Échec de la mise à jour du statut');
      } finally {
        setPendingAction(null);
        setSelectedBooking(null);
        setShowConfirmDialog(false);
      }
    }
  };

  const showBookingDetails = (booking: any) => {
    setSelectedBooking(booking);
    setShowDetailsDialog(true);
  };

  const filteredBookings = bookings.filter(b => {
    const statusMatch = filter === 'ALL' || b.status === filter;
    const nameToMatch = b.guest_name || 'Client';
    const roomToMatch = b.room_type_name || 'Chambre';
    
    const searchMatch = searchTerm === '' ||
      nameToMatch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roomToMatch.toLowerCase().includes(searchTerm.toLowerCase());
    
    const checkInDate = b.checkIn || '';
    const checkOutDate = b.checkOut || '';
    const dateMatch = (!dateFilter.start || checkInDate >= dateFilter.start) &&
      (!dateFilter.end || checkOutDate <= dateFilter.end);

    return statusMatch && searchMatch && dateMatch;
  });

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED').length,
    pending: bookings.filter(b => b.status === 'PENDING').length,
    cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#6B5434] mb-4" />
        <p className="text-gray-500 font-medium">Chargement de vos réservations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Réservations</h1>
          <p className="text-gray-500 text-sm mt-1">Gérez les demandes de réservation en temps réel</p>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Sync. automatique (60s)
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500 mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500 mb-1">Confirmées</p>
          <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500 mb-1">En attente</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500 mb-1">Annulées</p>
          <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher par client ou chambre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="date"
                value={dateFilter.start}
                onChange={(e) => setDateFilter({ ...dateFilter, start: e.target.value })}
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent text-sm"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="date"
                value={dateFilter.end}
                onChange={(e) => setDateFilter({ ...dateFilter, end: e.target.value })}
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200 overflow-x-auto">
            {['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED'].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  filter === s 
                    ? s === 'PENDING' ? 'bg-yellow-500 text-white' : s === 'CONFIRMED' ? 'bg-green-600 text-white' : s === 'CANCELLED' ? 'bg-red-500 text-white' : 'bg-[#6B5434] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {s === 'ALL' ? 'Tout' : s === 'PENDING' ? 'En attente' : s === 'CONFIRMED' ? 'Confirmé' : 'Annulé'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-[#FAF6F1] text-gray-700 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Ref.</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Chambre</th>
                <th className="px-6 py-4">Dates</th>
                <th className="px-6 py-4">Prix</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.map((booking) => (
                <tr 
                  key={booking.id} 
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => showBookingDetails(booking)}
                >
                  <td className="px-6 py-4">
                    <div className="font-mono text-xs text-gray-400">#{booking.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className="p-2 bg-[#C6A87C]/10 rounded-full text-[#C6A87C] font-bold text-xs uppercase">
                         {(booking.guest_name || "C").charAt(0)}
                       </div>
                       <span className="font-medium text-gray-900">{booking.guest_name || "Client"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700">{booking.room_type_name}</td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{booking.checkIn}</div>
                    <div className="text-xs text-gray-400">au {booking.checkOut}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-[#6B5434]">{booking.totalPrice?.toLocaleString()} MRU</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      booking.status === 'CONFIRMED' || booking.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                      booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    {booking.status === 'PENDING' && (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleStatusChangeRequest(booking.id, 'CONFIRMED')}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg bg-white border border-green-200 transition-shadow hover:shadow-sm"
                          title="Accepter"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => handleStatusChangeRequest(booking.id, 'CANCELLED')}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg bg-white border border-red-200 transition-shadow hover:shadow-sm"
                          title="Refuser"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                    {booking.status === 'CONFIRMED' && (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleStatusChangeRequest(booking.id, 'COMPLETED')}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg bg-white border border-blue-200 transition-shadow hover:shadow-sm"
                          title="Marquer comme Terminé"
                        >
                          <CheckCircle size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredBookings.length === 0 && (
          <div className="text-center py-20 bg-gray-50/50">
            <AlertCircle className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 font-medium">Aucune réservation ne correspond à vos critères.</p>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => {
          setShowConfirmDialog(false);
          setPendingAction(null);
          setSelectedBooking(null);
        }}
        onConfirm={confirmStatusChange}
        title={
          pendingAction?.status === 'CONFIRMED' ? 'Confirmer la réservation' : 
          pendingAction?.status === 'COMPLETED' ? 'Terminer le séjour' :
          'Annuler la réservation'
        }
        message={
          pendingAction?.status === 'CONFIRMED'
            ? `Voulez-vous confirmer la réservation de ${selectedBooking?.guest_name} pour "${selectedBooking?.room_type_name}" ?`
            : pendingAction?.status === 'COMPLETED'
            ? `Voulez-vous marquer le séjour de ${selectedBooking?.guest_name} comme étant terminé ? Cela permettra au client de laisser un avis.`
            : `Voulez-vous vraiment annuler la réservation de ${selectedBooking?.guest_name} ? Le client sera notifié.`
        }
        confirmText={pendingAction?.status === 'CONFIRMED' ? 'Confirmer' : 'Annuler la réservation'}
        type={pendingAction?.status === 'CONFIRMED' ? 'info' : 'danger'}
      />

      <FormDialog
        isOpen={showDetailsDialog}
        onClose={() => {
          setShowDetailsDialog(false);
          setSelectedBooking(null);
        }}
        title="Détails de la Réservation"
      >
        {selectedBooking && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Référence</p>
                <p className="font-mono text-sm font-black text-gray-900">#{selectedBooking.id}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Créée le</p>
                <p className="text-sm font-bold text-gray-700">{new Date(selectedBooking.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-black text-[#C6A87C] uppercase tracking-widest mb-3 flex items-center gap-2">
                <User size={14} /> Client
              </h4>
              <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">Nom Complet:</span>
                  <span className="text-sm font-bold text-gray-900">{selectedBooking.guest_name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">ID Utilisateur:</span>
                  <span className="text-sm font-mono text-gray-600">{selectedBooking.user}</span>
                </div>
                <button
                  onClick={() => {
                    navigate('/owner/messages', { 
                      state: { 
                        startWith: { 
                          id: selectedBooking.user, 
                          name: selectedBooking.guest_name,
                          hotelId: selectedBooking.hotelId || selectedBooking.hotel
                        } 
                      } 
                    });
                  }}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2 bg-[#C6A87C] text-white rounded-lg hover:bg-[#B5966A] transition-colors font-bold text-sm"
                >
                  <MessageSquare size={16} />
                  Contacter le client
                </button>
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-xs font-black text-[#C6A87C] uppercase tracking-widest mb-3 flex items-center gap-2">
                <Calendar size={14} /> Séjours & Facturation
              </h4>
              <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Hébergement:</span>
                  <span className="text-sm font-bold text-gray-900">{selectedBooking.room_type_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Arrivée:</span>
                  <span className="text-sm font-bold text-gray-900">{selectedBooking.checkIn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Départ:</span>
                  <span className="text-sm font-bold text-gray-900">{selectedBooking.checkOut}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t mt-2">
                  <span className="text-base font-bold text-gray-900">Total payé:</span>
                  <span className="text-xl font-black text-[#6B5434]">{selectedBooking.totalPrice?.toLocaleString()} MRU</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="text-sm font-bold text-gray-500">Statut actuel:</span>
                <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                  selectedBooking.status === 'CONFIRMED' || selectedBooking.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                  selectedBooking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {selectedBooking.status}
                </span>
            </div>
          </div>
        )}
      </FormDialog>
    </div>
  );
}
