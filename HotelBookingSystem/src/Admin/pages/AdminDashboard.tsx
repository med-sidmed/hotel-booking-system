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
} from 'lucide-react';
import { cn } from '../../lib/utils';

const data = [
  { name: 'Jan', revenue: 4000, bookings: 240 },
  { name: 'Fev', revenue: 3000, bookings: 198 },
  { name: 'Mar', revenue: 5000, bookings: 300 },
  { name: 'Avr', revenue: 2780, bookings: 200 },
  { name: 'Mai', revenue: 6890, bookings: 400 },
  { name: 'Juin', revenue: 8390, bookings: 500 },
  { name: 'Juil', revenue: 9490, bookings: 580 },
];

const statusData = [
  { name: 'Confirmé', value: 60, color: '#6B5434' },
  { name: 'En attente', value: 30, color: '#C6A87C' },
  { name: 'Annulé', value: 10, color: '#E8DCC8' },
];

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Hôtels', value: '64', trend: '+12%', icon: Building2, color: 'orange' },
    { label: 'Total Chambres', value: '357', trend: '+5%', icon: DoorOpen, color: 'blue' },
    { label: 'Réservations', value: '480', trend: '+24%', icon: CalendarCheck, color: 'green' },
    { label: 'Revenus', value: '124,594 MRU', trend: '+18%', icon: Wallet, color: 'gold' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tableau de Bord Admin</h1>
          <p className="text-sm text-gray-500">Vue d'ensemble de la performance Luxotel</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2">
             <CalendarCheck size={16} /> Janv 2026 - Juil 2026
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
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
              <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                <TrendingUp size={12} /> {stat.trend}
              </span>
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</h3>
            <p className="text-sm font-medium text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1A1A1A] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tendance des Revenus</h3>
            <select className="bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-xs font-bold px-3 py-2 outline-none">
              <option>Revenus (MRU)</option>
              <option>Réservations</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C6A87C" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#C6A87C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
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

        {/* Status Pie Chart */}
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
              <span className="text-2xl font-black text-gray-900 dark:text-white">85%</span>
              <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Succès</span>
            </div>
          </div>
          <div className="mt-8 space-y-4">
            {statusData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Activity Table */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Activité Récente</h3>
          <button className="text-sm font-bold text-[#C6A87C] hover:underline">Voir tout</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Client</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Type Chambre</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Montant</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {[
                { name: 'Sophie Martin', room: 'Suite Deluxe', date: '16 Jan 2026', amount: '350€', status: 'Confirmé', color: 'green' },
                { name: 'Pierre Dupont', room: 'Chambre Standard', date: '15 Jan 2026', amount: '180€', status: 'En attente', color: 'yellow' },
                { name: 'Marie Currie', room: 'Villa Océan', date: '14 Jan 2026', amount: '450€', status: 'Confirmé', color: 'green' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#C6A87C]/10 text-[#C6A87C] flex items-center justify-center font-bold text-xs">
                        {row.name.charAt(0)}
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 font-medium">{row.room}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{row.date}</td>
                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{row.amount}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                      row.color === 'green' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    )}>
                      {row.status}
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
