import { useState, useEffect } from 'react';
import Header from "../components/Header";
import type { Booking } from '../types';
import { useFavorites } from '../context/FavoritesContext';
import { bookingService } from '../api/booking.service';
import { hotelService } from '../api/hotel.service';
import { HotelCard } from '../components/HotelCard';
import { useAuth } from '../context/AuthContext';

export default function UserProfilePage() {
  const { favorites } = useFavorites();
  const [activeTab, setActiveTab] = useState<'bookings' | 'favorites'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favoriteHotels, setFavoriteHotels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [bookingsData, allHotels] = await Promise.all([
          bookingService.getBookings(),
          hotelService.getHotels()
        ]);
        setBookings(bookingsData);
        setFavoriteHotels(allHotels.filter(h => favorites.includes(h.id)));
      } catch (err) {
        console.error('Failed to fetch profile data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [favorites]);

  if (isLoading) return <div className="text-center py-12">Chargement de votre profil...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header/>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* User Info Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-gray-500">
                  {user?.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{user?.name}</h2>
                  <p className="text-gray-500">{user?.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                 <button 
                  onClick={() => setActiveTab('bookings')}
                  className={`w-full text-left px-4 py-2 rounded font-medium ${activeTab === 'bookings' ? 'bg-[#6B5434] text-white' : 'hover:bg-gray-50 text-gray-700'}`}
                 >
                   Mes Réservations
                 </button>
                 <button 
                  onClick={() => setActiveTab('favorites')}
                  className={`w-full text-left px-4 py-2 rounded font-medium ${activeTab === 'favorites' ? 'bg-[#6B5434] text-white' : 'hover:bg-gray-50 text-gray-700'}`}
                 >
                   Mes Favoris
                 </button>
                 <hr className="my-2 border-gray-200" />
                 <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-50 text-gray-700 font-medium">
                   Modifier le profil
                 </button>
                 <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-50 text-gray-700 font-medium">
                   Changer le mot de passe
                 </button>
                 <button onClick={logout} className="w-full text-left px-4 py-2 rounded hover:bg-gray-50 text-red-600 font-medium">
                   Se déconnecter
                 </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-2">
            
            {activeTab === 'bookings' && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">Mes Réservations</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">Réservation #{booking.id}</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {booking.checkIn} — {booking.checkOut}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold
                          ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 
                            booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                          {booking.status === 'CONFIRMED' ? 'CONFIRMÉ' : booking.status === 'PENDING' ? 'EN ATTENTE' : booking.status}
                        </span>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="font-bold text-gray-900">{booking.totalPrice}€</span>
                        <button className="text-[#6B5434] hover:text-[#5B4424] text-sm font-medium">
                          Voir les détails
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Mes Hôtels Favoris ({favoriteHotels.length})</h3>
                {favoriteHotels.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {favoriteHotels.map(hotel => (
                      <HotelCard key={hotel.id} hotel={hotel} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow p-8 text-center">
                    <p className="text-gray-500">Vous n'avez pas encore de favoris.</p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
