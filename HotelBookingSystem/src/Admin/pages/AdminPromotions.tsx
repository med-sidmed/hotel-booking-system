import { useState } from 'react';
import { mockPromotions } from '../../data/mockData';
import { Plus, Edit, Trash2, Copy, Calendar, TrendingUp } from 'lucide-react';
import type { Promotion } from '../../types';
import { ConfirmDialog, FormDialog } from '../../components/Dialog';
import toast from 'react-hot-toast';

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    discountType: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
    discountValue: 0,
    validFrom: '',
    validUntil: '',
    minPurchase: 0,
    maxDiscount: 0,
    usageLimit: 0
  });

  const handleDelete = (promo: Promotion) => {
    setSelectedPromo(promo);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedPromo) {
      setPromotions(promotions.filter(p => p.id !== selectedPromo.id));
      toast.success(`Promotion "${selectedPromo.code}" supprimée avec succès`);
      setSelectedPromo(null);
    }
  };

  const handleEdit = (promo: Promotion) => {
    setSelectedPromo(promo);
    setFormData({
      code: promo.code,
      title: promo.title,
      description: promo.description,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      validFrom: promo.validFrom,
      validUntil: promo.validUntil,
      minPurchase: promo.minPurchase || 0,
      maxDiscount: promo.maxDiscount || 0,
      usageLimit: promo.usageLimit || 0
    });
    setShowFormDialog(true);
  };

  const handleCreate = () => {
    setSelectedPromo(null);
    setFormData({
      code: '',
      title: '',
      description: '',
      discountType: 'PERCENTAGE',
      discountValue: 0,
      validFrom: '',
      validUntil: '',
      minPurchase: 0,
      maxDiscount: 0,
      usageLimit: 0
    });
    setShowFormDialog(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedPromo) {
      // Update
      setPromotions(promotions.map(p => 
        p.id === selectedPromo.id 
          ? { ...p, ...formData }
          : p
      ));
      toast.success(`Promotion "${formData.code}" mise à jour`);
    } else {
      // Create
      const newPromo: Promotion = {
        id: `PROMO-${Date.now()}`,
        ...formData,
        usedCount: 0,
        active: true
      };
      setPromotions([...promotions, newPromo]);
      toast.success(`Promotion "${formData.code}" créée avec succès`);
    }
    setShowFormDialog(false);
  };

  const handleToggleActive = (id: string) => {
    const promo = promotions.find(p => p.id === id);
    setPromotions(promotions.map(p => 
      p.id === id ? { ...p, active: !p.active } : p
    ));
    toast.success(promo?.active ? `Promotion désactivée` : `Promotion activée`);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Code ${code} copié !`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Promotions & Codes Promo</h1>
          <p className="text-gray-500 text-sm mt-1">Gérez vos offres et codes promotionnels</p>
        </div>
        <button 
          onClick={handleCreate}
          className="px-4 py-2 bg-[#C6A87C] hover:bg-[#B5966A] text-white rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} />
          Nouvelle Promotion
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Promotions Actives</p>
              <p className="text-2xl font-bold text-green-600">{promotions.filter(p => p.active).length}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Utilisations</p>
              <p className="text-2xl font-bold text-blue-600">{promotions.reduce((acc, p) => acc + p.usedCount, 0)}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Calendar className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Taux Utilisation Moyen</p>
              <p className="text-2xl font-bold text-purple-600">
                {promotions.length > 0 
                  ? ((promotions.reduce((acc, p) => acc + (p.usageLimit ? (p.usedCount / p.usageLimit) * 100 : 0), 0) / promotions.length).toFixed(0))
                  : 0}%
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Promotions List */}
      <div className="grid grid-cols-1 gap-4">
        {promotions.map((promo) => {
          const usagePercent = promo.usageLimit ? (promo.usedCount / promo.usageLimit) * 100 : 0;
          const isExpired = new Date(promo.validUntil) < new Date();

          return (
            <div key={promo.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition

-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{promo.title}</h3>
                    <div className="flex gap-2">
                      {promo.active && !isExpired && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Actif</span>
                      )}
                      {isExpired && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Expiré</span>
                      )}
                      {!promo.active && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">Désactivé</span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{promo.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Code</p>
                      <div className="flex items-center gap-2">
                        <p className="font-mono font-bold text-[#C6A87C]">{promo.code}</p>
                        <button onClick={() => copyCode(promo.code)} className="text-gray-400 hover:text-[#C6A87C]">
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Réduction</p>
                      <p className="font-semibold text-gray-900">
                        {promo.discountType === 'PERCENTAGE' ? `${promo.discountValue}%` : `${promo.discountValue} MRU`}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Validité</p>
                      <p className="text-sm text-gray-700">{promo.validFrom} → {promo.validUntil}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Utilisations</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {promo.usedCount} / {promo.usageLimit || '∞'}
                      </p>
                    </div>
                  </div>

                  {promo.usageLimit && (
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progression</span>
                        <span>{usagePercent.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${usagePercent >= 90 ? 'bg-red-500' : usagePercent >= 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${Math.min(usagePercent, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-6">
                  <button 
                    onClick={() => handleToggleActive(promo.id)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      promo.active 
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {promo.active ? 'Désactiver' : 'Activer'}
                  </button>
                  <button 
                    onClick={() => handleEdit(promo)}
                    className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                  >
                    <Edit size={16} />
                    Modifier
                  </button>
                  <button 
                    onClick={() => handleDelete(promo)}
                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {promotions.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500">Aucune promotion créée pour le moment.</p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Supprimer la promotion"
        message={`Êtes-vous sûr de vouloir supprimer la promotion "${selectedPromo?.code}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        type="danger"
      />

      {/* Form Dialog */}
      <FormDialog
        isOpen={showFormDialog}
        onClose={() => setShowFormDialog(false)}
        title={selectedPromo ? 'Modifier la Promotion' : 'Nouvelle Promotion'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Code Promo *</label>
              <input 
                type="text" 
                required
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
                placeholder="SUMMER2026"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
                placeholder="Offre Été"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
              rows={3}
              placeholder="Description de la promotion..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type Réduction *</label>
              <select 
                value={formData.discountType}
                onChange={(e) => setFormData({...formData, discountType: e.target.value as 'PERCENTAGE' | 'FIXED'})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
              >
                <option value="PERCENTAGE">Pourcentage (%)</option>
                <option value="FIXED">Montant Fixe (MRU)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valeur *</label>
              <input 
                type="number" 
                required
                min="0"
                value={formData.discountValue}
                onChange={(e) => setFormData({...formData, discountValue: Number(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valide Du *</label>
              <input 
                type="date" 
                required
                value={formData.validFrom}
                onChange={(e) => setFormData({...formData, validFrom: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valide Jusqu'au *</label>
              <input 
                type="date" 
                required
                value={formData.validUntil}
                onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Achat Min (MRU)</label>
              <input 
                type="number" 
                min="0"
                value={formData.minPurchase}
                onChange={(e) => setFormData({...formData, minPurchase: Number(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Réduction Max</label>
              <input 
                type="number" 
                min="0"
                value={formData.maxDiscount}
                onChange={(e) => setFormData({...formData, maxDiscount: Number(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Limite Utilisation</label>
              <input 
                type="number" 
                min="0"
                value={formData.usageLimit}
                onChange={(e) => setFormData({...formData, usageLimit: Number(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
              />
            </div>
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
              {selectedPromo ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </FormDialog>
    </div>
  );
}
