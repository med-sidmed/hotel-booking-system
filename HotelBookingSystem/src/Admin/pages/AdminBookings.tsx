import { useState, useEffect } from 'react';
import { bookingService } from '../../api/booking.service';
import type { Booking } from '../../types';
import toast from 'react-hot-toast';

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const data = await bookingService.getBookings();
      setBookings(data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      toast.error('Erreur lors du chargement des réservations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter(b => 
    filter === 'all' || b.status === filter.toUpperCase()
  );

  const getStatusColor = (status: string) => {
      switch(status.toUpperCase()) {
          case 'CONFIRMED': return 'bg-green-100 text-green-800';
          case 'PENDING': return 'bg-yellow-100 text-yellow-800';
          case 'CANCELLED': return 'bg-red-100 text-red-800';
          case 'COMPLETED': return 'bg-blue-100 text-blue-800';
          default: return 'bg-gray-100 text-gray-800';
      }
  };

  const getStatusLabel = (status: string) => {
      switch(status.toUpperCase()) {
          case 'CONFIRMED': return 'Confirmé';
          case 'PENDING': return 'En attente';
          case 'CANCELLED': return 'Annulé';
          case 'COMPLETED': return 'Terminé';
          default: return status;
      }
  };

  const handleStatusChange = async (id: string | number, newStatus: string) => {
      try {
          const updated = await bookingService.updateBookingStatus(id, newStatus);
          setBookings(bookings.map(b => b.id === id ? updated : b));
          toast.success(`Statut mis à jour : ${getStatusLabel(newStatus)}`);
      } catch (err) {
          toast.error('Erreur lors de la mise à jour du statut');
      }
  };

  if (isLoading) return <div className="text-center py-12">Chargement des réservations...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Réservations</h1>
        <div className="flex flex-wrap gap-2">
            <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded-md text-sm font-medium ${filter === 'all' ? 'bg-[#6B5434] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>Tous</button>
            <button onClick={() => setFilter('confirmed')} className={`px-3 py-1 rounded-md text-sm font-medium ${filter === 'confirmed' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>Confirmés</button>
            <button onClick={() => setFilter('pending')} className={`px-3 py-1 rounded-md text-sm font-medium ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>En attente</button>
            <button onClick={() => setFilter('cancelled')} className={`px-3 py-1 rounded-md text-sm font-medium ${filter === 'cancelled' ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>Annulés</button>
            <button onClick={() => setFilter('completed')} className={`px-3 py-1 rounded-md text-sm font-medium ${filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>Terminés</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hôtel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking: any) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <span className="text-xs text-gray-400">#</span>{String(booking.id).substring(0, 8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{booking.hotel_name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{booking.guest_name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{new Date(booking.checkIn).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-400">au {new Date(booking.checkOut).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{booking.totalPrice} MRU</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                      {getStatusLabel(booking.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <select 
                      className="text-xs border-gray-300 rounded-md shadow-sm focus:border-[#6B5434] focus:ring focus:ring-[#6B5434] focus:ring-opacity-50"
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                    >
                        <option value="PENDING">En attente</option>
                        <option value="CONFIRMED">Confirmer</option>
                        <option value="COMPLETED">Terminer</option>
                        <option value="CANCELLED">Annuler</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredBookings.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Aucune réservation trouvée.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
