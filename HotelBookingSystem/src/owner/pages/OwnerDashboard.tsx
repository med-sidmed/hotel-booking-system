import { useState, useEffect } from 'react';
import { hotelService } from '../../api/hotel.service';
import { bookingService } from '../../api/booking.service';
import { useAuth } from '../../context/AuthContext';
import type { Hotel, Booking } from '../../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie, 
  Cell,
} from 'recharts';
import { 
  Building2, 
  DoorOpen, 
  CalendarCheck, 
  Wallet,
  LayoutGrid,
  Star
} from 'lucide-react';
import { cn } from '../../lib/utils';

const occupancyData = [
  { name: 'Lun', taux: 65 },
  { name: 'Mar', taux: 70 },
  { name: 'Mer', taux: 85 },
  { name: 'Jeu', taux: 75 },
  { name: 'Ven', taux: 95 },
  { name: 'Sam', taux: 100 },
  { name: 'Dim', taux: 80 },
];

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [hotelsList, setHotelsList] = useState<Hotel[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Backend should filtering hotels by owner if we are in owner mode
        const [hotelsData, bookingsData] = await Promise.all([
          hotelService.getHotels(),
          bookingService.getBookings() 
        ]);
        setHotelsList(hotelsData);
        setBookings(bookingsData);
      } catch (err) {
        console.error('Failed to fetch owner data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalRooms = hotelsList.reduce((acc, curr) => acc + (curr.rooms?.length || 0), 0);
  const activeBookings = bookings.filter(b => b.status === 'CONFIRMED').length;
  const pendingBookings = bookings.filter(b => b.status === 'PENDING').length;
  const cancelledBookings = bookings.filter(b => b.status === 'CANCELLED').length;
  const totalRevenue = bookings
    .filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
    .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

  const completionRate = bookings.length > 0 
    ? Math.round((activeBookings / bookings.length) * 100) 
    : 0;

  const statusData = [
    { name: 'Confirmé', value: activeBookings, color: '#6B5434' },
    { name: 'En attente', value: pendingBookings, color: '#C6A87C' },
    { name: 'Annulé', value: cancelledBookings, color: '#E8DCC8' },
  ];

  const stats = [
    { label: 'Vos Hôtels', value: hotelsList.length.toString(), sub: hotelsList[0]?.name || 'Aucun hôtel', icon: Building2, color: 'brown' },
    { label: 'Total Chambres', value: totalRooms, sub: 'Opérationnel', icon: DoorOpen, color: 'blue' },
    { label: 'Réservations', value: activeBookings, sub: `${pendingBookings} nouvelles`, icon: CalendarCheck, color: 'green' },
    { label: 'Revenus', value: `${totalRevenue} MRU`, sub: 'Total cumulé', icon: Wallet, color: 'gold' },
  ];

  if (isLoading) return <div className="text-center py-12">Chargement du dashboard...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tableau de Bord Manager</h1>
          <p className="text-sm text-gray-500">Gérez votre établissement et vos revenus ({user?.name})</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2">
             <Star className="text-yellow-500" size={16} fill="currentColor" /> 4.8 Note Moyenne
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#1A1A1A] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden relative group">
            <div className="flex items-center justify-between mb-4">
              <div className={cn(
                "p-3 rounded-xl",
                stat.color === 'brown' ? "bg-[#6B5434]/10 text-[#6B5434]" :
                stat.color === 'blue' ? "bg-blue-50 text-blue-600" :
                stat.color === 'green' ? "bg-green-50 text-green-600" :
                "bg-yellow-50 text-yellow-600"
              )}>
                <stat.icon size={24} />
              </div>
              <LayoutGrid size={16} className="text-gray-300 group-hover:text-[#C6A87C] transition-colors" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</h3>
            <p className="text-sm font-bold text-gray-500">{stat.label}</p>
            <p className="text-xs font-medium text-gray-400 mt-2">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Occupancy Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1A1A1A] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Taux d'Occupation Hebdomadaire</h3>
            <span className="text-xs font-bold text-[#C6A87C] bg-[#C6A87C]/10 px-2 py-1 rounded">Derniers 7 jours</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#9CA3AF', fontSize: 12}}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#9CA3AF', fontSize: 12}}
                  unit="%"
                />
                <Tooltip 
                  cursor={{fill: '#F9FAFB'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar 
                  dataKey="taux" 
                  fill="#C6A87C" 
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown Pie */}
        <div className="lg:col-span-1 bg-white dark:bg-[#1A1A1A] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-8">Efficacité des Ventes</h3>
          <div className="h-[240px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <span className="text-2xl font-black text-gray-900 dark:text-white">{completionRate}%</span>
              <span className="text-[10px] uppercase font-bold text-gray-400">Confirmé</span>
            </div>
          </div>
          <div className="mt-8 space-y-3">
            {statusData.map((item, i) => (
              <div key={i} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{item.name}</span>
                </div>
                <span className="text-sm font-black text-gray-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Recent Table */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Dernières Réservations</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Chambre</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Hôtel</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase font-mono">ID</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Montant</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase text-center">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {bookings.slice(0, 10).map((booking: any) => (
                <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-900 dark:text-white">{booking.user_name || "Client"}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 font-medium">{booking.room_type_name || "Chambre"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{booking.hotel_name || "Hôtel"}</td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-400">{booking.id.toString().slice(0, 8)}...</td>
                  <td className="px-6 py-4 font-black text-[#C6A87C]">{booking.totalPrice} MRU</td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase",
                      booking.status === 'CONFIRMED' ? "bg-green-100 text-green-700" :
                      booking.status === 'PENDING' ? "bg-yellow-100 text-yellow-700" :
                      booking.status === 'COMPLETED' ? "bg-blue-100 text-blue-700" :
                      "bg-red-100 text-red-700"
                    )}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-medium">
                    Aucune réservation trouvée pour vos établissements.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
