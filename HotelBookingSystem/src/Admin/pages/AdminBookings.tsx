import { useState } from 'react';

// Mock bookings data since we don't have a global store for it yet
const initialBookings = [
  { id: 'BLK-001', hotelName: 'Grand Hotel Luxotel', guestName: 'Sophie Martin', checkIn: '2026-02-10', checkOut: '2026-02-15', total: 1250, status: 'confirmed' },
  { id: 'BLK-002', hotelName: 'Escale en Bord de Mer', guestName: 'Jean Dupont', checkIn: '2026-03-01', checkOut: '2026-03-03', total: 320, status: 'pending' },
  { id: 'BLK-003', hotelName: 'Chalet Alpin', guestName: 'Marie Curie', checkIn: '2026-01-20', checkOut: '2026-01-25', total: 850, status: 'cancelled' },
];

export default function AdminBookings() {
  const [bookings, setBookings] = useState(initialBookings);
  const [filter, setFilter] = useState('all');

  const filteredBookings = bookings.filter(b => filter === 'all' || b.status === filter);

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'confirmed': return 'bg-green-100 text-green-800';
          case 'pending': return 'bg-yellow-100 text-yellow-800';
          case 'cancelled': return 'bg-red-100 text-red-800';
          default: return 'bg-gray-100 text-gray-800';
      }
  };

  const handleStatusChange = (id: string, newStatus: string) => {
      setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Réservations</h1>
        <div className="flex space-x-2">
            <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded-md text-sm font-medium ${filter === 'all' ? 'bg-[#6B5434] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>Tous</button>
            <button onClick={() => setFilter('confirmed')} className={`px-3 py-1 rounded-md text-sm font-medium ${filter === 'confirmed' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>Confirmés</button>
            <button onClick={() => setFilter('pending')} className={`px-3 py-1 rounded-md text-sm font-medium ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>En attente</button>
            <button onClick={() => setFilter('cancelled')} className={`px-3 py-1 rounded-md text-sm font-medium ${filter === 'cancelled' ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>Annulés</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
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
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{booking.hotelName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{booking.guestName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{booking.checkIn}</div>
                    <div className="text-xs">au {booking.checkOut}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{booking.total}€</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                    {booking.status === 'confirmed' ? 'Confirmé' : booking.status === 'pending' ? 'En attente' : 'Annulé'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <select 
                    className="text-xs border-gray-300 rounded-md shadow-sm focus:border-[#6B5434] focus:ring focus:ring-[#6B5434] focus:ring-opacity-50"
                    value={booking.status}
                    onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                  >
                      <option value="confirmed">Confirmer</option>
                      <option value="pending">En attente</option>
                      <option value="cancelled">Annuler</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
