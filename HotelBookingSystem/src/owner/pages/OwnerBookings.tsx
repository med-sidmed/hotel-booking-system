import { useEffect, useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import toast from 'react-hot-toast';
import { mockBookings } from '@/data/mockData';
import { AlertCircle, Calendar, Check, Search, User, X } from 'lucide-react';
import { ConfirmDialog, FormDialog } from '@/components/Dialog';

export default function OwnerBookings() {
  const myHotelId = 1;
  const [bookings, setBookings] = useState(mockBookings.filter(b => b.hotelId === myHotelId));
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [pendingAction, setPendingAction] = useState<{ id: string; status: string } | null>(null);
  const { addNotification } = useNotifications();

  // Real-time refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real app, this would fetch from API
      const newBookings = mockBookings.filter(b => b.hotelId === myHotelId);
      
      // Check if there are new bookings
      if (newBookings.length > bookings.length) {
        const newCount = newBookings.length - bookings.length;
        toast.success(`${newCount} nouvelle${newCount > 1 ? 's' : ''} réservation${newCount > 1 ? 's' : ''} !`, {
          icon: '🔔',
          duration: 5000
        });
        setBookings(newBookings);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [bookings.length, myHotelId]);

  const handleStatusChangeRequest = (id: string, newStatus: string) => {
    const booking = bookings.find(b => b.id === id);
    setPendingAction({ id, status: newStatus });
    setSelectedBooking(booking);
    setShowConfirmDialog(true);
  };

  const confirmStatusChange = () => {
    if (pendingAction && selectedBooking) {
      setBookings(bookings.map(b =>
        b.id === pendingAction.id ? { ...b, status: pendingAction.status } : b
      ));
      
      const statusText = pendingAction.status === 'CONFIRMED' ? 'confirmée' : 'annulée';
      toast.success(`Réservation ${statusText} avec succès`);

      // Trigger notification for the client
      addNotification({
        userId: selectedBooking.userId,
        type: pendingAction.status === 'CONFIRMED' ? 'BOOKING_CONFIRMED' : 'BOOKING_CANCELLED',
        title: `Réservation ${pendingAction.status === 'CONFIRMED' ? 'Confirmée' : 'Annulée'}`,
        message: `Votre réservation pour "${selectedBooking.roomType}" a été ${statusText} par l'établissement.`,
        actionUrl: '/profile/bookings'
      });
      
      setPendingAction(null);
      setSelectedBooking(null);
      setShowConfirmDialog(false);
    }
  };

  const showBookingDetails = (booking: any) => {
    setSelectedBooking(booking);
    setShowDetailsDialog(true);
  };

  // Filter bookings
  const filteredBookings = bookings.filter(b => {
    const matchesStatus = filter === 'ALL' || b.status === filter;
    const matchesSearch = searchTerm === '' ||
      b.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.roomType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDateRange = (!dateFilter.start || b.checkIn >= dateFilter.start) &&
      (!dateFilter.end || b.checkOut <= dateFilter.end);

    return matchesStatus && matchesSearch && matchesDateRange;
  });

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
    pending: bookings.filter(b => b.status === 'PENDING').length,
    cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Réservations</h1>
          <p className="text-gray-500 text-sm mt-1">Gérez les demandes de réservation en temps réel</p>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Actualisation automatique
        </div>
      </div>

      {/* Stats */}
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

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher par client ou type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
              />
            </div>
          </div>

          {/* Date Range */}
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

          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === 'ALL' ? 'bg-[#6B5434] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Tout
            </button>
            <button
              onClick={() => setFilter('PENDING')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === 'PENDING' ? 'bg-yellow-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              En attente
            </button>
            <button
              onClick={() => setFilter('CONFIRMED')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === 'CONFIRMED' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Confirmé
            </button>
            <button
              onClick={() => setFilter('CANCELLED')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === 'CANCELLED' ? 'bg-red-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Annulé
            </button>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-[#FAF6F1] text-gray-700 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Référence</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Chambre</th>
                <th className="px-6 py-4">Dates</th>
                <th className="px-6 py-4">Prix Total</th>
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
                    <div className="font-mono text-xs text-gray-500">{booking.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-50 rounded-full">
                        <User size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{booking.userName}</div>
                        <div className="text-xs text-gray-400">ID: {booking.userId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{booking.roomType}</td>
                  <td className="px-6 py-4">
                    <div>{booking.checkIn}</div>
                    <div className="text-xs text-gray-400">au {booking.checkOut}</div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-[#6B5434]">{booking.totalPrice} MRU</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
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
                          className="p-1 text-green-600 hover:bg-green-50 rounded bg-white border border-green-200 transition-colors"
                          title="Accepter"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => handleStatusChangeRequest(booking.id, 'CANCELLED')}
                          className="p-1 text-red-600 hover:bg-red-50 rounded bg-white border border-red-200 transition-colors"
                          title="Refuser"
                        >
                          <X size={16} />
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
          <div className="text-center py-12">
            <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500">Aucune réservation trouvée</p>
          </div>
        )}
      </div>

      {/* Confirm Status Change Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => {
          setShowConfirmDialog(false);
          setPendingAction(null);
          setSelectedBooking(null);
        }}
        onConfirm={confirmStatusChange}
        title={pendingAction?.status === 'CONFIRMED' ? 'Confirmer la réservation' : 'Annuler la réservation'}
        message={
          pendingAction?.status === 'CONFIRMED'
            ? `Voulez-vous confirmer la réservation de ${selectedBooking?.userName} pour "${selectedBooking?.roomType}" ?`
            : `Voulez-vous vraiment annuler la réservation de ${selectedBooking?.userName} ? Le client sera notifié.`
        }
        confirmText={pendingAction?.status === 'CONFIRMED' ? 'Confirmer' : 'Annuler la réservation'}
        type={pendingAction?.status === 'CONFIRMED' ? 'info' : 'danger'}
      />

      {/* Booking Details Dialog */}
      <FormDialog
        isOpen={showDetailsDialog}
        onClose={() => {
          setShowDetailsDialog(false);
          setSelectedBooking(null);
        }}
        title="Détails de la Réservation"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Référence</p>
                <p className="font-mono text-sm font-semibold">{selectedBooking.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date de réservation</p>
                <p className="font-semibold">{selectedBooking.date}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Informations Client</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nom:</span>
                  <span className="font-semibold">{selectedBooking.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ID Client:</span>
                  <span className="font-mono text-sm">{selectedBooking.userId}</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Détails du Séjour</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type de chambre:</span>
                  <span className="font-semibold">{selectedBooking.roomType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Arrivée:</span>
                  <span className="font-semibold">{selectedBooking.checkIn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Départ:</span>
                  <span className="font-semibold">{selectedBooking.checkOut}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Prix Total:</span>
                  <span className="font-bold text-[#6B5434]">{selectedBooking.totalPrice} MRU</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Statut:</span>
                <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                  selectedBooking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                  selectedBooking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {selectedBooking.status}
                </span>
              </div>
            </div>
          </div>
        )}
      </FormDialog>
    </div>
  );
}
