import { useState } from 'react';
import { mockLoyaltyPoints } from '../../data/mockData';
import { Award, TrendingUp, Plus, Edit, Trash2, Gift } from 'lucide-react';
import { ConfirmDialog, FormDialog } from '../../components/Dialog';
import toast from 'react-hot-toast';

interface LoyaltyMember {
  userId: string;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  totalPoints: number;
  transactionHistory: Array<{
    date: string;
    points: number;
    type: 'EARNED' | 'REDEEMED';
    description: string;
  }>;
}

export default function AdminLoyalty() {
  const [loyaltyPrograms, setLoyaltyPrograms] = useState<LoyaltyMember[]>(mockLoyaltyPoints);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<LoyaltyMember | null>(null);
  const [formData, setFormData] = useState({
    userId: '',
    points: 0,
    type: 'EARNED' as 'EARNED' | 'REDEEMED',
    description: ''
  });

  const tierConfig = {
    BRONZE: { minPoints: 0, color: 'bg-orange-600', discount: '5%' },
    SILVER: { minPoints: 500, color: 'bg-gray-400', discount: '10%' },
    GOLD: { minPoints: 1500, color: 'bg-yellow-500', discount: '15%' },
    PLATINUM: { minPoints: 5000, color: 'bg-purple-600', discount: '20%' }
  };

  const calculateTier = (points: number): 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' => {
    if (points >= 5000) return 'PLATINUM';
    if (points >= 1500) return 'GOLD';
    if (points >= 500) return 'SILVER';
    return 'BRONZE';
  };

  const totalMembers = loyaltyPrograms.length;
  const totalPointsIssued = loyaltyPrograms.reduce((acc, lp) => acc + lp.totalPoints, 0);
  const tierDistribution = {
    BRONZE: loyaltyPrograms.filter(lp => lp.tier === 'BRONZE').length,
    SILVER: loyaltyPrograms.filter(lp => lp.tier === 'SILVER').length,
    GOLD: loyaltyPrograms.filter(lp => lp.tier === 'GOLD').length,
    PLATINUM: loyaltyPrograms.filter(lp => lp.tier === 'PLATINUM').length,
  };

  const handleDelete = (member: LoyaltyMember) => {
    setSelectedMember(member);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedMember) {
      setLoyaltyPrograms(loyaltyPrograms.filter(m => m.userId !== selectedMember.userId));
      toast.success(`Membre ${selectedMember.userId} supprimé du programme`);
      setSelectedMember(null);
    }
  };

  const handleAddPoints = (member: LoyaltyMember) => {
    setSelectedMember(member);
    setFormData({
      userId: member.userId,
      points: 0,
      type: 'EARNED',
      description: ''
    });
    setShowFormDialog(true);
  };

  const handleSubmitPoints = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMember) return;

    const newPoints = formData.type === 'EARNED' 
      ? selectedMember.totalPoints + formData.points
      : selectedMember.totalPoints - formData.points;

    const newTier = calculateTier(newPoints);

    const updatedMember: LoyaltyMember = {
      ...selectedMember,
      totalPoints: Math.max(0, newPoints),
      tier: newTier,
      transactionHistory: [
        {
          date: new Date().toISOString().split('T')[0],
          points: formData.points,
          type: formData.type,
          description: formData.description
        },
        ...selectedMember.transactionHistory
      ]
    };

    setLoyaltyPrograms(loyaltyPrograms.map(m => 
      m.userId === selectedMember.userId ? updatedMember : m
    ));

    toast.success(`${formData.points} points ${formData.type === 'EARNED' ? 'ajoutés' : 'retirés'} pour ${selectedMember.userId}`);
    setShowFormDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Programme de Fidélité</h1>
          <p className="text-gray-500 text-sm mt-1">Gestion des membres et points</p>
        </div>
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
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleAddPoints(program)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                      >
                        <Plus size={14} />
                        Points
                      </button>
                      <button 
                        onClick={() => handleDelete(program)}
                        className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1"
                      >
                        <Trash2 size={14} />
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {loyaltyPrograms.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <Award className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500">Aucun membre dans le programme de fidélité.</p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Supprimer le membre"
        message={`Êtes-vous sûr de vouloir retirer ${selectedMember?.userId} du programme de fidélité ? Tous ses points seront perdus.`}
        confirmText="Supprimer"
        type="danger"
      />

      {/* Add/Remove Points Dialog */}
      <FormDialog
        isOpen={showFormDialog}
        onClose={() => setShowFormDialog(false)}
        title={`Gérer les Points - ${selectedMember?.userId}`}
      >
        <form onSubmit={handleSubmitPoints} className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Points actuels</p>
            <p className="text-2xl font-bold text-[#C6A87C]">{selectedMember?.totalPoints.toLocaleString()}</p>
            <p className="text-sm text-gray-600 mt-1">
              Tier: <span className="font-semibold">{selectedMember?.tier}</span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type d'opération *</label>
            <select 
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value as 'EARNED' | 'REDEEMED'})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
            >
              <option value="EARNED">➕ Ajouter des points</option>
              <option value="REDEEMED">➖ Retirer des points</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de points *</label>
            <input 
              type="number" 
              required
              min="1"
              value={formData.points}
              onChange={(e) => setFormData({...formData, points: Number(e.target.value)})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
              placeholder="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea 
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
              rows={3}
              placeholder="Réservation d'hôtel, Cadeau, Compensation..."
            />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <button
              type="button"
              onClick={() => setShowFormDialog(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#C6A87C] hover:bg-[#B5966A] text-white rounded-lg font-medium transition-colors"
            >
              Confirmer
            </button>
          </div>
        </form>
      </FormDialog>
    </div>
  );
}
