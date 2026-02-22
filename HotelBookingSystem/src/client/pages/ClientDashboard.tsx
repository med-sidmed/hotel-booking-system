import { useState, useEffect } from 'react';
import { bookingService } from '../../api/booking.service';
import type { Booking } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Calendar, DollarSign } from 'lucide-react';

export default function ClientDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await bookingService.getBookings();
        setBookings(data || []);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeBookings = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING').length;
  const totalSpent = bookings
    .filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
    .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Bienvenue, {user?.name || 'Client'}!</h1>
        <p className="text-gray-500 text-sm mt-1">Voici un aperçu de votre compte</p>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-gray-500 font-medium">Chargement de vos statistiques...</div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                  <Calendar size={24} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{activeBookings}</h3>
              <p className="text-sm text-gray-500 mt-1">Réservations Actives</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-50 rounded-lg text-green-600">
                  <DollarSign size={24} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{totalSpent} MRU</h3>
              <p className="text-sm text-gray-500 mt-1">Dépenses Totales</p>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Réservations Récentes</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-700 font-medium">
                  <tr>
                    <th className="px-6 py-3">ID</th>
                    <th className="px-6 py-3">Chambre</th>
                    <th className="px-6 py-3">Hôtel</th>
                    <th className="px-6 py-3">Dates</th>
                    <th className="px-6 py-3">Prix</th>
                    <th className="px-6 py-3">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.slice(0, 5).map((booking: any) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{booking.id.toString().slice(0, 8)}...</td>
                      <td className="px-6 py-4 font-medium">{booking.room_type_name || "Chambre"}</td>
                      <td className="px-6 py-4">{booking.hotel_name || "Hôtel"}</td>
                      <td className="px-6 py-4">
                        <div>{booking.checkIn}</div>
                        <div className="text-xs text-gray-400">au {booking.checkOut}</div>
                      </td>
                      <td className="px-6 py-4 font-semibold">{booking.totalPrice} MRU</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                          booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                          booking.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                        Aucune réservation récente trouvée.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
