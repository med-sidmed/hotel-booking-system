import { mockLoyaltyPoints } from '../../data/mockData';
import { Gift, TrendingUp, Award, Star } from 'lucide-react';

export default function LoyaltyPage() {
  const userId = 101;
  const loyaltyData = mockLoyaltyPoints.find(lp => lp.userId === userId);

  if (!loyaltyData) {
    return <div>Chargement...</div>;
  }

  const tierBenefits = {
    BRONZE: { discount: '5%', checkoutTime: '12h', wifi: 'Standard' },
    SILVER: { discount: '10%', checkoutTime: '13h', wifi: 'Premium' },
    GOLD: { discount: '15%', checkoutTime: '14h', wifi: 'Premium + Travail' },
    PLATINUM: { discount: '20%', checkoutTime: '15h', wifi: 'Illimité Premium' }
  };

  const currentBenefits = tierBenefits[loyaltyData.tier];
  const nextTier = loyaltyData.tier === 'PLATINUM' ? null : 
    loyaltyData.tier === 'GOLD' ? 'PLATINUM' :
    loyaltyData.tier === 'SILVER' ? 'GOLD' : 'SILVER';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Programme de Fidélité</h1>
        <p className="text-gray-500 text-sm mt-1">Vos points et récompenses</p>
      </div>

      {/* Points Card */}
      <div className="bg-gradient-to-r from-[#6B5434] to-[#C6A87C] rounded-xl p-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-white/80 text-sm mb-2">Vos Points Totaux</p>
            <h2 className="text-4xl font-bold">{loyaltyData.totalPoints}</h2>
            <p className="text-white/90 mt-2">Statut: {loyaltyData.tier}</p>
          </div>
          <div className="p-4 bg-white/20 rounded-lg">
            <Award size={32} />
          </div>
        </div>
        {nextTier && (
          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-white/80 text-sm">Prochain niveau: {nextTier}</p>
            <div className="mt-2 w-full bg-white/20 rounded-full h-3">
              <div className="bg-white rounded-full h-3" style={{ width: '60%' }}></div>
            </div>
            <p className="text-white/90 text-sm mt-1">Plus que 500 points pour passer au niveau {nextTier}</p>
          </div>
        )}
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-50 rounded-lg text-green-600">
              <TrendingUp size={24} />
            </div>
            <h3 className="font-bold text-gray-800">Réduction</h3>
          </div>
          <p className="text-2xl font-bold text-[#C6A87C]">{currentBenefits.discount}</p>
          <p className="text-sm text-gray-500 mt-1">Sur chaque réservation</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
              <Star size={24} />
            </div>
            <h3 className="font-bold text-gray-800">Check-out</h3>
          </div>
          <p className="text-2xl font-bold text-[#C6A87C]">{currentBenefits.checkoutTime}</p>
          <p className="text-sm text-gray-500 mt-1">Check-out tardif</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
              <Gift size={24} />
            </div>
            <h3 className="font-bold text-gray-800">Wi-Fi</h3>
          </div>
          <p className="text-lg font-bold text-[#C6A87C]">{currentBenefits.wifi}</p>
          <p className="text-sm text-gray-500 mt-1">Accès internet</p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Historique des Points</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {loyaltyData.transactionHistory.map((tx) => (
            <div key={tx.id} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50">
              <div>
                <p className="font-medium text-gray-900">{tx.reason}</p>
                <p className="text-sm text-gray-500">{tx.date}</p>
              </div>
              <div className={`text-lg font-bold ${tx.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {tx.points > 0 ? '+' : ''}{tx.points} pts
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
