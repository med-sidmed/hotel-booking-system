import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Calendar, Users, Download, FileText } from 'lucide-react';
import { statsService, type AdminStats } from '../../api/stats.service';
import toast from 'react-hot-toast';

export default function AdminAnalytics() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await statsService.getAdminStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        toast.error('Erreur lors du chargement des statistiques');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleExportPDF = () => {
    alert('Export PDF - Fonctionnalité à implémenter avec jsPDF');
  };

  const handleExportExcel = () => {
    alert('Export Excel - Fonctionnalité à implémenter');
  };

  if (isLoading) return <div className="text-center py-12 text-gray-500">Chargement des analytics...</div>;
  if (!stats) return <div className="text-center py-12 text-red-500">Impossible de charger les données.</div>;

  const { kpis, monthly_data, top_hotels, status_distribution } = stats;

  const statusMap: Record<string, { label: string, color: string }> = {
    'CONFIRMED': { label: 'Confirmé', color: '#10B981' },
    'PENDING': { label: 'En Attente', color: '#F59E0B' },
    'CANCELLED': { label: 'Annulé', color: '#EF4444' },
    'COMPLETED': { label: 'Terminé', color: '#3B82F6' }
  };

  const statusData = status_distribution.map(item => ({
    name: statusMap[item.status]?.label || item.status,
    value: item.count,
    color: statusMap[item.status]?.color || '#9CA3AF'
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analytics & Rapports</h1>
          <p className="text-gray-500 text-sm mt-1">Insights et métriques de performance en temps réel</p>
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
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Revenu Total</p>
          <p className="text-2xl font-bold text-gray-900">{kpis.total_revenue.toLocaleString()} MRU</p>
          <p className="text-xs text-green-600 mt-2">Mise à jour en direct</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Calendar className="text-blue-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Taux d'Occupation</p>
          <p className="text-2xl font-bold text-gray-900">{kpis.occupancy_rate}%</p>
          <p className="text-xs text-gray-500 mt-2">{kpis.occupied_rooms}/{kpis.total_rooms} chambres</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">ADR (Taux Moyen)</p>
          <p className="text-2xl font-bold text-gray-900">{kpis.adr.toLocaleString()} MRU</p>
          <p className="text-xs text-gray-500 mt-2">Par nuitée</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-lg">
              <Users className="text-orange-600" size={24} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">RevPAR</p>
          <p className="text-2xl font-bold text-gray-900">{kpis.rev_par.toLocaleString()} MRU</p>
          <p className="text-xs text-gray-500 mt-2">Revenu/chambre dispo</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue */}
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Revenus Mensuels</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthly_data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#6B5434" strokeWidth={2} name="Revenu (MRU)" />
              <Line type="monotone" dataKey="bookings" stroke="#C6A87C" strokeWidth={1} name="Réservations" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Booking Status */}
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Statut des Réservations</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
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
      <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Top Hôtels - Performance</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={top_hotels}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="bookings" fill="#3B82F6" name="Réservations" />
            <Bar yAxisId="right" dataKey="revenue" fill="#6B5434" name="Revenu (MRU)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
