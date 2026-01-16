import { useState } from 'react';
import { mockBookings } from '../../data/mockData';
import { Check, X, Filter } from 'lucide-react';

export default function OwnerBookings() {
    const myHotelId = 1;
    const [bookings, setBookings] = useState(mockBookings.filter(b => b.hotelId === myHotelId));
    const [filter, setFilter] = useState('ALL');

    const handleStatusChange = (id: string, newStatus: string) => {
        setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
    };

    const filteredBookings = bookings.filter(b => filter === 'ALL' || b.status === filter);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Réservations</h1>
                    <p className="text-gray-500 text-sm mt-1">Gérez les demandes de réservation</p>
                </div>
                
                <div className="flex items-center space-x-2 bg-white p-1 rounded-lg border border-gray-200">
                    <button 
                        onClick={() => setFilter('ALL')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === 'ALL' ? 'bg-[#6B5434] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Tout
                    </button>
                    <button 
                         onClick={() => setFilter('PENDING')}
                         className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === 'PENDING' ? 'bg-yellow-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        En attente
                    </button>
                    <button 
                         onClick={() => setFilter('CONFIRMED')}
                         className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === 'CONFIRMED' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Confirmé
                    </button>
                    <button 
                         onClick={() => setFilter('CANCELLED')}
                         className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === 'CANCELLED' ? 'bg-red-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Annulé
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-[#FAF6F1] text-gray-700 font-medium border-b border-gray-200">
                            <tr>
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
                                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{booking.userName}</div>
                                        <div className="text-xs text-gray-400">ID: {booking.userId}</div>
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
                                    <td className="px-6 py-4 text-right">
                                        {booking.status === 'PENDING' && (
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => handleStatusChange(booking.id, 'CONFIRMED')}
                                                    className="p-1 text-green-600 hover:bg-green-50 rounded bg-white border border-green-200"
                                                    title="Accepter"
                                                >
                                                    <Check size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleStatusChange(booking.id, 'CANCELLED')}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded bg-white border border-red-200"
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
                        <p className="text-gray-500">Aucune réservation trouvée dans cette catégorie.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
