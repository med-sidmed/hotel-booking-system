import { useState } from 'react';
import { mockBookings } from '../../data/mockData';
import { Download, Calendar, MapPin, TrendingUp, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function MyBookings() {
  const userId = 101; // Mock logged-in user
  const [filter, setFilter] = useState('ALL');
  
  const userBookings = mockBookings.filter(b => b.userId === userId);
  const filteredBookings = userBookings.filter(b => 
    filter === 'ALL' || b.status === filter
  );

  // Calculate statistics
  const stats = {
    total: userBookings.length,
    confirmed: userBookings.filter(b => b.status === 'CONFIRMED').length,
    pending: userBookings.filter(b => b.status === 'PENDING').length,
    cancelled: userBookings.filter(b => b.status === 'CANCELLED').length,
    totalSpent: userBookings
      .filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
      .reduce((acc, curr) => acc + curr.totalPrice, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Mes Réservations</h1>
        <p className="text-gray-500 text-sm mt-1">Gérez et consultez vos réservations</p>
      </div>

      {/* Statistics Dashboard */}
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

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
          <button 
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              filter === 'ALL' ? 'bg-[#C6A87C] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Tout ({stats.total})
          </button>
          <button 
            onClick={() => setFilter('CONFIRMED')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              filter === 'CONFIRMED' ? 'bg-green-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Confirmé ({stats.confirmed})
          </button>
          <button 
            onClick={() => setFilter('PENDING')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              filter === 'PENDING' ? 'bg-yellow-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            En Attente ({stats.pending})
          </button>
          <button 
            onClick={() => setFilter('CANCELLED')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              filter === 'CANCELLED' ? 'bg-red-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Annulé ({stats.cancelled})
          </button>
        </div>
        
        <div className="text-sm text-gray-500">
          {filteredBookings.length} résultat{filteredBookings.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* Bookings List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredBookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all hover:border-[#C6A87C]/30">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-bold text-gray-800">{booking.roomType}</h3>
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
                    <span>Hôtel Élégance Royal, Nouakchott</span>
                  </div>

                  <div className="flex items-center text-gray-600 text-sm">
                    <Calendar size={16} className="mr-2 text-gray-400" />
                    <span className="font-medium">{booking.checkIn}</span>
                    <span className="mx-2">→</span>
                    <span className="font-medium">{booking.checkOut}</span>
                    <span className="ml-2 text-gray-400">
                      ({Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24))} nuits)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Prix Total</p>
                    <p className="text-xl font-bold text-[#C6A87C]">{booking.totalPrice} MRU</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date Réservation</p>
                    <p className="text-sm font-medium text-gray-700">{booking.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Référence</p>
                    <p className="text-sm font-mono text-gray-700">{booking.id}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 ml-6">
                <button className="px-4 py-2 bg-[#C6A87C] hover:bg-[#B5966A] text-white rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm">
                  <Download size={16} />
                  Facture
                </button>
                {booking.status === 'CONFIRMED' && (
                  <button className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium text-sm transition-colors border border-red-200">
                    Annuler
                  </button>
                )}
                {booking.status === 'COMPLETED' && (
                  <button className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-medium text-sm transition-colors border border-blue-200">
                    Laisser un Avis
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
            {filter === 'ALL' 
              ? "Vous n'avez pas encore de réservation. Parcourez nos hôtels pour réserver !" 
              : `Aucune réservation avec le statut "${filter}"`}
          </p>
          {filter === 'ALL' && (
            <a 
              href="/hotels" 
              className="inline-flex items-center px-6 py-3 bg-[#C6A87C] hover:bg-[#B5966A] text-white rounded-lg font-medium transition-colors shadow-sm"
            >
              Parcourir les Hôtels
            </a>
          )}
        </div>
      )}
    </div>
  );
}
