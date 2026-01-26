import { useState } from 'react';
import { User, Mail, Phone, Lock, Bell, Shield, Camera, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ClientSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: 'profile', name: 'Profil', icon: User },
    { id: 'security', name: 'Sécurité', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Paramètres enregistrés avec succès !');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Paramètres</h1>
        <p className="text-gray-500 text-sm mt-1">Gérez vos informations personnelles et préférences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Navigation Sidebar */}
        <div className="w-full md:w-64 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#C6A87C] text-white shadow-lg shadow-[#C6A87C]/20'
                    : 'text-gray-600 hover:bg-white hover:shadow-sm'
                }`}
              >
                <Icon size={20} />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          {activeTab === 'profile' && (
            <form onSubmit={handleSave} className="space-y-8">
              {/* Profile Photo */}
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-[#C6A87C]/10 flex items-center justify-center text-[#C6A87C] border-2 border-[#C6A87C]/20 overflow-hidden">
                    <User size={40} />
                  </div>
                  <button type="button" className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-100 text-gray-500 hover:text-[#C6A87C] transition-colors">
                    <Camera size={16} />
                  </button>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Votre Photo</h3>
                  <p className="text-sm text-gray-500 mt-1">Cliquez sur l'icône pour modifier votre photo de profil.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Nom Complet</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C6A87C]/20 focus:border-[#C6A87C] outline-none transition-all"
                      defaultValue="Sophie Martin"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Adresse Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C6A87C]/20 focus:border-[#C6A87C] outline-none transition-all"
                      defaultValue="sophie.martin@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Numéro de Téléphone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="tel"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C6A87C]/20 focus:border-[#C6A87C] outline-none transition-all"
                      defaultValue="+222 40 00 00 00"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Ville</label>
                  <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C6A87C]/20 focus:border-[#C6A87C] outline-none transition-all appearance-none cursor-pointer">
                    <option>Nouakchott</option>
                    <option>Nouadhibou</option>
                    <option>Atar</option>
                    <option>Rosso</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Bio</label>
                <textarea
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C6A87C]/20 focus:border-[#C6A87C] outline-none transition-all"
                  rows={4}
                  placeholder="Dites-nous en un peu plus sur vous..."
                ></textarea>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#6B5434] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#5B4424] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? 'Enregistrement...' : (
                    <>
                      <Check size={20} />
                      Sauvegarder les modifications
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8">
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <Shield className="text-blue-500 shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-blue-900">Conseil de sécurité</h4>
                  <p className="text-sm text-blue-700 mt-1">Utilisez un mot de passe fort combinant majuscules, chiffres et caractères spéciaux pour protéger votre compte.</p>
                </div>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Mot de passe actuel</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C6A87C]/20 focus:border-[#C6A87C] outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Nouveau mot de passe</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C6A87C]/20 focus:border-[#C6A87C] outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Confirmer le nouveau mot de passe</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C6A87C]/20 focus:border-[#C6A87C] outline-none transition-all"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="bg-[#6B5434] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#5B4424] transition-all shadow-lg hover:shadow-xl"
                  >
                    Mettre à jour le mot de passe
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              {[
                { id: 'email', name: 'Notifications par email', desc: 'Recevez des mises à jour sur vos réservations par email.' },
                { id: 'push', name: 'Notifications Push', desc: 'Alertes en temps réel sur votre navigateur ou application mobile.' },
                { id: 'sms', name: 'Notifications SMS', desc: 'Alertes importantes envoyées directement sur votre téléphone.' },
                { id: 'promo', name: 'Offres promotionnelles', desc: 'Restez informé des meilleures réductions et offres exclusives.' },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100">
                  <div>
                    <h4 className="font-bold text-gray-800">{item.name}</h4>
                    <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C6A87C]"></div>
                  </label>
                </div>
              ))}
              
              <div className="flex justify-end pt-8 border-t border-gray-100">
                <button
                  onClick={handleSave}
                  className="bg-[#6B5434] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#5B4424] transition-all shadow-lg hover:shadow-xl"
                >
                  Sauvegarder les préférences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
