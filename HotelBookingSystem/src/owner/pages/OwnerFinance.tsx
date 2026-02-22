import { useState, useEffect } from 'react';
import { statsService, type AdminStats } from '../../api/stats.service';
import { BarChart3, TrendingUp, DollarSign, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

export default function OwnerFinance() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await statsService.getAdminStats();
                setStats(data);
            } catch (err) {
                console.error('Failed to fetch finance stats:', err);
                toast.error('Erreur lors du chargement des données financières');
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#6B5434] mb-4" />
                <p className="text-gray-500">Chargement de vos rapports financiers...</p>
            </div>
        );
    }

    if (!stats) return <div className="text-center py-12 text-red-500">Erreur lors de la récupération des données.</div>;

    const { kpis, monthly_data } = stats;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Rapports Financiers</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Revenu Total</p>
                            <h3 className="text-2xl font-bold text-gray-800 text-[#6B5434]">{kpis.total_revenue.toLocaleString()} MRU</h3>
                        </div>
                    </div>
                     <span className="text-xs text-green-600 font-medium">Revenu cumulé de vos hôtels</span>
                 </div>

                 <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                            <BarChart3 size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">ADR (Taux Moyen)</p>
                            <h3 className="text-2xl font-bold text-gray-800 text-[#6B5434]">{kpis.adr.toLocaleString()} MRU</h3>
                        </div>
                    </div>
                    <span className="text-xs text-gray-400">Par nuitée occupée</span>
                 </div>

                 <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">RevPAR</p>
                            <h3 className="text-2xl font-bold text-gray-800 text-[#6B5434]">{kpis.rev_par.toLocaleString()} MRU</h3>
                        </div>
                    </div>
                    <span className="text-xs text-gray-400">Revenu par chambre disponible</span>
                 </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Évolution des Revenus</h3>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthly_data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                            <Tooltip 
                                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                formatter={(value: number | undefined) => [`${(value || 0).toLocaleString()} MRU`, 'Revenu']}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="revenue" 
                                stroke="#6B5434" 
                                strokeWidth={3} 
                                dot={{r: 6, fill: '#6B5434', strokeWidth: 2, stroke: '#fff'}}
                                activeDot={{r: 8, strokeWidth: 0}}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
