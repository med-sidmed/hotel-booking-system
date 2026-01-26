import { useState } from 'react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: 'PakVista Hotel & Resort',
    contactEmail: 'contact@pakvista.com',
    currency: 'EUR',
    maintenanceMode: false,
    bookingsEnabled: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // Handle checkbox separately
    const checked = (e.target as HTMLInputElement).checked;
    
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate save
    alert('Paramètres sauvegardés avec succès !');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <h1 className="text-2xl font-bold text-gray-800">Paramètres du Site</h1>

       <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* General Settings */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100 space-y-4 md:col-span-2">
               <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Général</h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Nom du Site</label>
                       <input 
                            type="text" 
                            name="siteName"
                            value={settings.siteName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-[#6B5434] focus:border-[#6B5434]"
                       />
                   </div>
                    <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Email de Contact</label>
                       <input 
                            type="email" 
                            name="contactEmail"
                            value={settings.contactEmail}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-[#6B5434] focus:border-[#6B5434]"
                       />
                   </div>
                    <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Devise par défaut</label>
                       <select 
                            name="currency"
                            value={settings.currency}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-[#6B5434] focus:border-[#6B5434]"
                       >
                           <option value="EUR">Euro (€)</option>
                           <option value="USD">Dollar ($)</option>
                           <option value="GBP">Livre (£)</option>
                       </select>
                   </div>
               </div>
           </div>

           {/* System Settings */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100 space-y-4">
               <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Système</h2>
               
               <div className="flex items-center justify-between py-2">
                   <div>
                       <p className="font-medium text-gray-900">Mode Maintenance</p>
                       <p className="text-xs text-gray-500">Rendre le site inaccessible aux utilisateurs</p>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            name="maintenanceMode"
                            checked={settings.maintenanceMode}
                            onChange={handleChange}
                            className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#6B5434]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6B5434]"></div>
                   </label>
               </div>

                <div className="flex items-center justify-between py-2">
                   <div>
                       <p className="font-medium text-gray-900">Activer les Réservations</p>
                       <p className="text-xs text-gray-500">Autoriser les nouvelles réservations</p>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            name="bookingsEnabled"
                            checked={settings.bookingsEnabled}
                            onChange={handleChange}
                            className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#6B5434]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6B5434]"></div>
                   </label>
               </div>
           </div>

           {/* Security Settings (Mock) */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100 space-y-4">
               <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Sécurité</h2>
               <button type="button" className="w-full text-left px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm">
                   Changer le mot de passe administrateur
               </button>
               <button type="button" className="w-full text-left px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm">
                   Journaux d'activité
               </button>
           </div>

           <div className="md:col-span-2 flex justify-end">
               <button 
                type="submit"
                className="bg-[#6B5434] hover:bg-[#5B4424] text-white px-8 py-3 rounded-md font-bold transition-colors shadow-lg"
               >
                   Sauvegarder les modifications
               </button>
           </div>
       </form>
    </div>
  );
}
