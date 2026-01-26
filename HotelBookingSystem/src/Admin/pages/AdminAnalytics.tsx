import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Calendar, Users, Download, FileText } from 'lucide-react';
import { hotels, mockBookings, mockTransactions } from '../../data/mockData';

export default function AdminAnalytics() {
  // Calculate KPIs
  const totalRevenue = mockTransactions
    .filter(t => t.status === 'COMPLETED')
    .reduce((acc, curr) => acc + curr.amount, 0);
  
  const totalBookings = mockBookings.length;
  const totalRooms = hotels.reduce((acc, hotel) => acc + hotel.rooms.length, 0);
  const occupiedRooms = mockBookings.filter(b => b.status === 'CONFIRMED').length;
  const occupancyRate = ((occupiedRooms / totalRooms) * 100).toFixed(1);
  
  // ADR (Average Daily Rate)
  const adr = totalBookings > 0 ? (totalRevenue / totalBookings).toFixed(0) : 0;
  
  // RevPAR (Revenue Per Available Room)
  const revPAR = totalRooms > 0 ? (totalRevenue / totalRooms).toFixed(0) : 0;

  // Monthly Revenue Data
  const monthlyData = [
    { month: 'Jan', revenue: 45000, bookings: 28 },
    { month: 'Fev', revenue: 52000, bookings: 35 },
    { month: 'Mar', revenue: 48000, bookings: 30 },
    { month: 'Avr', revenue: 61000, bookings: 42 },
    { month: 'Mai', revenue: 55000, bookings: 38 },
    { month: 'Juin', revenue: 70000, bookings: 48 },
  ];

  // Hotel Performance
  const hotelPerformance = hotels.map(hotel => ({
    name: hotel.name.substring(0, 20),
    bookings: mockBookings.filter(b => b.hotelId === hotel.id).length,
    revenue: mockBookings
      .filter(b => b.hotelId === hotel.id && b.status === 'CONFIRMED')
      .reduce((acc, b) => acc + b.totalPrice, 0)
  })).sort((a, b) => b.revenue - a.revenue).slice(0, 10);

  // Booking Status Distribution
  const statusData = [
    { name: 'Confirmé', value: mockBookings.filter(b => b.status === 'CONFIRMED').length, color: '#10B981' },
    { name: 'En Attente', value: mockBookings.filter(b => b.status === 'PENDING').length, color: '#F59E0B' },
    { name: 'Annulé', value: mockBookings.filter(b => b.status === 'CANCELLED').length, color: '#EF4444' },
  ];

  const handleExportPDF = () => {
    alert('Export PDF - Fonctionnalité à implémenter avec jsPDF');
  };

  const handleExportExcel = () => {
    alert('Export Excel - Fonctionnalité à implémenter');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analytics & Rapports</h1>
          <p className="text-gray-500 text-sm mt-1">Insights et métriques de performance</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportPDF} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm">
            <FileText size={16} />
            Export PDF
          </button>
          <button onClick={handleExportExcel} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm">
            <Download size={16} />
            Export Excel
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Revenu Total</p>
          <p className="text-2xl font-bold text-gray-900">{totalRevenue.toLocaleString()} MRU</p>
          <p className="text-xs text-green-600 mt-2">+12% vs mois dernier</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Calendar className="text-blue-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Taux d'Occupation</p>
          <p className="text-2xl font-bold text-gray-900">{occupancyRate}%</p>
          <p className="text-xs text-gray-500 mt-2">{occupiedRooms}/{totalRooms} chambres</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">ADR (Taux Moyen)</p>
          <p className="text-2xl font-bold text-gray-900">{adr} MRU</p>
          <p className="text-xs text-gray-500 mt-2">Par nuitée</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-lg">
              <Users className="text-orange-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">RevPAR</p>
          <p className="text-2xl font-bold text-gray-900">{revPAR} MRU</p>
          <p className="text-xs text-gray-500 mt-2">Revenu/chambre dispo</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Revenus Mensuels</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#C6A87C" strokeWidth={2} name="Revenu (MRU)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Booking Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Statut des Réservations</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Hotels */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Top 10 Hôtels - Performance</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={hotelPerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="bookings" fill="#3B82F6" name="Réservations" />
            <Bar yAxisId="right" dataKey="revenue" fill="#C6A87C" name="Revenu (MRU)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
