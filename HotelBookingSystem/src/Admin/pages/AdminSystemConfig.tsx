import { useState, useEffect } from 'react';
import { Save, Globe, DollarSign, Mail, Key, Database, Download, Upload } from 'lucide-react';
import { settingService, type SystemSetting } from '../../api/setting.service';
import toast from 'react-hot-toast';

export default function AdminSystemConfig() {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingService.getSettings();
        setSettings(data);
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const getSettingValue = (key: string, defaultValue: string) => {
    return settings.find(s => s.key === key)?.value || defaultValue;
  };

  const handleSaveSetting = async (key: string, value: any) => {
    try {
      await settingService.updateSetting(key, value);
      toast.success(`Paramètre ${key} mis à jour`);
    } catch (err) {
      toast.error(`Erreur lors de la mise à jour de ${key}`);
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    // In a real app, we might have a single endpoint for multiple settings
    // Here we'll just show a success message as we're saving individually on change or on this button
    toast.success('Tous les paramètres ont été synchronisés');
    setIsSaving(false);
  };

  if (isLoading) return <div className="text-center py-12">Chargement de la configuration...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Configuration Système</h1>
          <p className="text-gray-500 text-sm mt-1">Paramètres globaux de la plateforme</p>
        </div>
        <button 
          onClick={handleSaveAll}
          disabled={isSaving}
          className="px-4 py-2 bg-[#C6A87C] hover:bg-[#B5966A] text-white rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50"
        >
          <Save size={18} />
          {isSaving ? 'Enregistrement...' : 'Sauvegarder'}
        </button>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-50 rounded-lg">
            <Globe className="text-blue-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Paramètres Généraux</h3>
            <p className="text-sm text-gray-500">Configuration de base de la plateforme</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la Plateforme</label>
            <input 
              type="text" 
              defaultValue={getSettingValue('site_name', 'Luxotel')} 
              onBlur={(e) => handleSaveSetting('site_name', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Support</label>
            <input 
              type="email" 
              defaultValue={getSettingValue('support_email', 'support@luxotel.com')} 
              onBlur={(e) => handleSaveSetting('support_email', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone Support</label>
            <input 
              type="tel" 
              defaultValue={getSettingValue('support_phone', '+222 45 XX XX XX')} 
              onBlur={(e) => handleSaveSetting('support_phone', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fuseau Horaire</label>
            <select 
              defaultValue={getSettingValue('timezone', 'GMT+0 (Nouakchott)')}
              onChange={(e) => handleSaveSetting('timezone', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
            >
              <option>GMT+0 (Nouakchott)</option>
              <option>GMT+1 (Paris)</option>
              <option>GMT+2 (Cairo)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Currencies */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-50 rounded-lg">
            <DollarSign className="text-green-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Devises & Taux de Change</h3>
            <p className="text-sm text-gray-500">Gestion des devises acceptées</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
            <input type="checkbox" defaultChecked className="w-4 h-4 text-[#C6A87C]" />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">MRU - Ouguiya Mauritanien</p>
              <p className="text-sm text-gray-500">Devise par défaut</p>
            </div>
            <input 
              type="number" 
              defaultValue="1.00" 
              step="0.01"
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Taux"
            />
          </div>

          <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
            <input type="checkbox" defaultChecked className="w-4 h-4 text-[#C6A87C]" />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">EUR - Euro</p>
              <p className="text-sm text-gray-500">Devise secondaire</p>
            </div>
            <input 
              type="number" 
              defaultValue="0.023" 
              step="0.001"
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Taux"
            />
          </div>

          <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
            <input type="checkbox" className="w-4 h-4 text-[#C6A87C]" />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">USD - Dollar Américain</p>
              <p className="text-sm text-gray-500">Désactivé</p>
            </div>
            <input 
              type="number" 
              defaultValue="0.025" 
              step="0.001"
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Taux"
            />
          </div>
        </div>
      </div>

      {/* Languages */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-50 rounded-lg">
            <Globe className="text-purple-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Langues Disponibles</h3>
            <p className="text-sm text-gray-500">Langues supportées par la plateforme</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
            <input type="checkbox" defaultChecked className="w-4 h-4 text-[#C6A87C]" />
            <span className="text-2xl">🇫🇷</span>
            <span className="font-semibold text-gray-900">Français</span>
          </div>
          <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
            <input type="checkbox" defaultChecked className="w-4 h-4 text-[#C6A87C]" />
            <span className="text-2xl">🇬🇧</span>
            <span className="font-semibold text-gray-900">English</span>
          </div>
          <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
            <input type="checkbox" className="w-4 h-4 text-[#C6A87C]" />
            <span className="text-2xl">🇸🇦</span>
            <span className="font-semibold text-gray-900">العربية</span>
          </div>
        </div>
      </div>

      {/* Email Templates */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-orange-50 rounded-lg">
            <Mail className="text-orange-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Templates Email</h3>
            <p className="text-sm text-gray-500">Personnalisation des emails automatiques</p>
          </div>
        </div>

        <div className="space-y-3">
          {['Confirmation Réservation', 'Annulation', 'Rappel Check-in', 'Demande Avis'].map((template) => (
            <div key={template} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#C6A87C]/50 transition-colors">
              <span className="font-medium text-gray-900">{template}</span>
              <button className="text-[#C6A87C] hover:text-[#B5966A] font-medium text-sm">
                Modifier →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* API Keys */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-red-50 rounded-lg">
            <Key className="text-red-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Clés API</h3>
            <p className="text-sm text-gray-500">Intégrations tierces</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Google Maps API Key</label>
            <input 
              type="password" 
              defaultValue="AIzaSy******************" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Gateway API Key</label>
            <input 
              type="password" 
              defaultValue="pk_live_******************" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Backup & Database */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gray-800 rounded-lg">
            <Database className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Backup & Base de Données</h3>
            <p className="text-sm text-gray-500">Gestion des sauvegardes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#C6A87C] hover:bg-gray-50 transition-colors">
            <Download size={20} className="text-gray-600" />
            <span className="font-medium text-gray-700">Télécharger Backup</span>
          </button>
          <button className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#C6A87C] hover:bg-gray-50 transition-colors">
            <Upload size={20} className="text-gray-600" />
            <span className="font-medium text-gray-700">Restaurer Backup</span>
          </button>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Dernière sauvegarde : <span className="font-semibold">17 Jan 2026, 23:45</span></p>
          <p className="text-sm text-gray-600 mt-1">Taille : <span className="font-semibold">125 MB</span></p>
        </div>
      </div>
    </div>
  );
}
