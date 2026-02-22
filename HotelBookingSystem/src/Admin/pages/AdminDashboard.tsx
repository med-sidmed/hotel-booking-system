import { useState, useEffect } from 'react';
import { hotelService } from '../../api/hotel.service';
import { bookingService } from '../../api/booking.service';
import { statsService, type AdminStats } from '../../api/stats.service';
import { useAuth } from '../../context/AuthContext';
import type { Hotel, Booking } from '../../types';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Building2, 
  DoorOpen, 
  CalendarCheck, 
  Wallet,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [hotelsData, bookingsData, statsData] = await Promise.all([
          hotelService.getHotels(),
          bookingService.getBookings(),
          statsService.getAdminStats()
        ]);
        setHotels(hotelsData);
        setBookings(bookingsData);
        setStats(statsData);
      } catch (err) {
        console.error('Failed to fetch admin dashboard data:', err);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
      return (
          <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#6B5434] mb-4" />
              <p className="text-gray-500 font-medium">Initialisation du tableau de bord...</p>
          </div>
      );
  }

  if (!stats) return <div className="text-center py-12 text-red-500 font-medium">Échec de la récupération des statistiques globales.</div>;

  const kpis = stats.kpis || { total_revenue: 0, occupancy_rate: 0, adr: 0, rev_par: 0, total_rooms: 0, occupied_rooms: 0 };
  const monthly_data = stats.monthly_data || [];
  const status_distribution = stats.status_distribution || [];

  const statusMap: Record<string, { label: string, color: string }> = {
    'CONFIRMED': { label: 'Confirmé', color: '#6B5434' },
    'PENDING': { label: 'En attente', color: '#C6A87C' },
    'CANCELLED': { label: 'Annulé', color: '#E8DCC8' },
    'COMPLETED': { label: 'Terminé', color: '#A38A64' }
  };

  const statusData = status_distribution.map(item => ({
    name: statusMap[item.status]?.label || item.status,
    value: item.count,
    color: statusMap[item.status]?.color || '#9CA3AF'
  }));

  const dashboardStats = [
    { label: 'Total Hôtels', value: hotels.length.toString(), trend: 'Live', icon: Building2, color: 'orange' },
    { label: 'Total Chambres', value: kpis.total_rooms.toString(), trend: 'Live', icon: DoorOpen, color: 'blue' },
    { label: 'Réservations', value: bookings.length.toString(), trend: 'Total', icon: CalendarCheck, color: 'green' },
    { label: 'Revenus', value: `${kpis.total_revenue.toLocaleString()} MRU`, trend: 'Brut', icon: Wallet, color: 'gold' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tableau de Bord Admin</h1>
          <p className="text-sm text-gray-500">Vue d'ensemble de la performance Luxotel ({user?.name})</p>
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2">
             <CalendarCheck size={16} className="text-[#C6A87C]" /> Données en temps réel
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#1A1A1A] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={cn(
                "p-3 rounded-xl transition-colors group-hover:scale-110 duration-300",
                stat.color === 'orange' ? "bg-orange-50 text-orange-600" :
                stat.color === 'blue' ? "bg-blue-50 text-blue-600" :
                stat.color === 'green' ? "bg-green-50 text-green-600" :
                "bg-yellow-50 text-yellow-600"
              )}>
                <stat.icon size={24} />
              </div>
              <span className="text-xs font-bold text-[#C6A87C] bg-orange-50 px-2 py-1 rounded-full flex items-center gap-1">
                <TrendingUp size={12} /> {stat.trend}
              </span>
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</h3>
            <p className="text-sm font-medium text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#1A1A1A] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tendance des Revenus</h3>
            <span className="text-xs text-gray-400 font-medium tracking-wide font-mono uppercase">6 derniers mois</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly_data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C6A87C" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#C6A87C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#9CA3AF', fontSize: 12}}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#9CA3AF', fontSize: 12}}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    backgroundColor: '#1F2937',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#C6A87C' }}
                  formatter={(value: number | undefined) => [`${(value || 0).toLocaleString()} MRU`, 'Revenu']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#C6A87C" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-1 bg-white dark:bg-[#1A1A1A] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-8">Statut des Réservations</h3>
          <div className="h-[240px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
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
              <span className="text-2xl font-black text-gray-900 dark:text-white">
                {bookings.length > 0 ? Math.round((kpis.occupied_rooms / bookings.length) * 100) : 0}%
              </span>
              <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Confiance</span>
            </div>
          </div>
          <div className="mt-8 space-y-4">
            {statusData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {bookings.length > 0 ? Math.round((item.value / bookings.length) * 100) : 0}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Activité Récente</h3>
          <a href="/admin/bookings" className="text-sm font-bold text-[#C6A87C] hover:underline">Voir tout</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Client</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Hôtel / Chambre</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Montant</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {bookings.slice(0, 8).map((booking: any) => (
                <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#C6A87C]/10 text-[#C6A87C] flex items-center justify-center font-bold text-xs uppercase">
                        {(booking.guest_name || "C").charAt(0)}
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">{booking.guest_name || "Client"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{booking.hotel_name || "N/A"}</div>
                      <div className="text-xs text-gray-500">{booking.room_type_name || "Chambre"}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-white font-mono text-sm">{booking.totalPrice} MRU</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                      booking.status === 'CONFIRMED' || booking.status === 'COMPLETED' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : 
                      booking.status === 'PENDING' ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    )}>
                      {statusMap[booking.status]?.label || booking.status}
                    </span>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-medium">
                    Aucune activité récente trouvée.
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
