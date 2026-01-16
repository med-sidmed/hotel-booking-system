import { useState } from 'react';
import { mockBookings } from '../../data/mockData';
import { BarChart3, TrendingUp, DollarSign } from 'lucide-react';

export default function OwnerFinance() {
    const myHotelId = 1;
    const myBookings = mockBookings.filter(b => b.hotelId === myHotelId && b.status === 'CONFIRMED');

    const totalRevenue = myBookings.reduce((acc, curr) => acc + curr.totalPrice, 0);
    const monthlyRevenue = totalRevenue * 0.12; // Mock calculation
    const averageDailyRate = myBookings.length > 0 ? totalRevenue / (myBookings.length * 4) : 0; // Approx 4 nights stay
    
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Rapports Financiers</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Revenu Total</p>
                            <h3 className="text-2xl font-bold text-gray-800">{totalRevenue.toLocaleString()} MRU</h3>
                        </div>
                    </div>
                     <span className="text-xs text-green-600 font-medium">+12% depuis le mois dernier</span>
                 </div>

                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                            <BarChart3 size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">ADR (Taux Moyen)</p>
                            <h3 className="text-2xl font-bold text-gray-800">{averageDailyRate.toFixed(0)} MRU</h3>
                        </div>
                    </div>
                    <span className="text-xs text-gray-400">Par nuitée occupée</span>
                 </div>

                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">RevPAR</p>
                            <h3 className="text-2xl font-bold text-gray-800">{(averageDailyRate * 0.65).toFixed(0)} MRU</h3>
                        </div>
                    </div>
                    <span className="text-xs text-gray-400">Revenu par chambre disponible</span>
                 </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96 flex items-center justify-center">
                 <p className="text-gray-400">Graphique des revenus (Intégration Recharts recommandée pour la suite)</p>
            </div>
        </div>
    );
}
