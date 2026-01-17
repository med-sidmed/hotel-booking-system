import { mockBookings, mockLoyaltyPoints } from '../../data/mockData';
import { Calendar, DollarSign, Heart, Star, TrendingUp } from 'lucide-react';

export default function ClientDashboard() {
  const userId = 101; // Mock logged-in user
  const userBookings = mockBookings.filter(b => b.userId === userId);
  const loyaltyData = mockLoyaltyPoints.find(lp => lp.userId === userId);

  const activeBookings = userBookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING').length;
  const completedBookings = userBookings.filter(b => b.status === 'COMPLETED').length;
  const totalSpent = userBookings
    .filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
    .reduce((acc, curr) => acc + curr.totalPrice, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Bienvenue, Sophie!</h1>
        <p className="text-gray-500 text-sm mt-1">Voici un aperçu de votre compte</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-50 rounded-lg text-yellow-600">
              <Star size={24} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{loyaltyData?.totalPoints || 0}</h3>
          <p className="text-sm text-gray-500 mt-1">Points Fidélité</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
              <TrendingUp size={24} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{loyaltyData?.tier || 'BRONZE'}</h3>
          <p className="text-sm text-gray-500 mt-1">Statut Fidélité</p>
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
                <th className="px-6 py-3">Dates</th>
                <th className="px-6 py-3">Prix</th>
                <th className="px-6 py-3">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {userBookings.slice(0, 5).map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{booking.id}</td>
                  <td className="px-6 py-4">{booking.roomType}</td>
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
