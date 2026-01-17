import { useState } from 'react';
import { mockLoyaltyPoints } from '../../data/mockData';
import { Award, TrendingUp, Plus, Gift } from 'lucide-react';

export default function AdminLoyalty() {
  const [loyaltyPrograms, setLoyaltyPrograms] = useState(mockLoyaltyPoints);

  const tierConfig = {
    BRONZE: { minPoints: 0, color: 'bg-orange-600', discount: '5%' },
    SILVER: { minPoints: 500, color: 'bg-gray-400', discount: '10%' },
    GOLD: { minPoints: 1500, color: 'bg-yellow-500', discount: '15%' },
    PLATINUM: { minPoints: 5000, color: 'bg-purple-600', discount: '20%' }
  };

  const totalMembers = loyaltyPrograms.length;
  const totalPointsIssued = loyaltyPrograms.reduce((acc, lp) => acc + lp.totalPoints, 0);
  const tierDistribution = {
    BRONZE: loyaltyPrograms.filter(lp => lp.tier === 'BRONZE').length,
    SILVER: loyaltyPrograms.filter(lp => lp.tier === 'SILVER').length,
    GOLD: loyaltyPrograms.filter(lp => lp.tier === 'GOLD').length,
    PLATINUM: loyaltyPrograms.filter(lp => lp.tier === 'PLATINUM').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Programme de Fidélité</h1>
          <p className="text-gray-500 text-sm mt-1">Gestion des membres et points</p>
        </div>
        <button className="px-4 py-2 bg-[#C6A87C] hover:bg-[#B5966A] text-white rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm">
          <Plus size={18} />
          Attribuer Points
        </button>
      </div>

      {/* Stats */}
     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Membres</p>
              <p className="text-2xl font-bold text-gray-900">{totalMembers}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Award className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Points Émis</p>
              <p className="text-2xl font-bold text-green-600">{totalPointsIssued.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Gift className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Moyenne Points</p>
              <p className="text-2xl font-bold text-purple-600">{totalMembers > 0 ? Math.round(totalPointsIssued / totalMembers) : 0}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Membres Gold+</p>
              <p className="text-2xl font-bold text-yellow-600">{tierDistribution.GOLD + tierDistribution.PLATINUM}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Award className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Tier Configuration */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Configuration des Tiers</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(tierConfig).map(([tier, config]) => (
            <div key={tier} className="border border-gray-200 rounded-lg p-4">
              <div className={`w-12 h-12 ${config.color} rounded-full flex items-center justify-center mb-3`}>
                <Award className="text-white" size={24} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{tier}</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>• Min: {config.minPoints} pts</p>
                <p>• Réduction: {config.discount}</p>
                <p>• Membres: {tierDistribution[tier as keyof typeof tierDistribution]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Membres du Programme</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-medium">
              <tr>
                <th className="px-6 py-3">Utilisateur ID</th>
                <th className="px-6 py-3">Points Totaux</th>
                <th className="px-6 py-3">Tier</th>
                <th className="px-6 py-3">Dernière Transaction</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loyaltyPrograms.map((program) => (
                <tr key={program.userId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">User #{program.userId}</td>
                  <td className="px-6 py-4 font-bold text-[#C6A87C]">{program.totalPoints.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${tierConfig[program.tier].color}`}>
                      {program.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {program.transactionHistory[0]?.date || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-[#C6A87C] hover:text-[#B5966A] font-medium text-sm">
                      Voir Détails →
                    </button>
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
