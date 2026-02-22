import { useState, useEffect } from 'react';
import type { UserProfile as User } from '../../types';
import { useInvitations } from '../../context/InvitationContext';
import { authService } from '../../api/auth.service';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'USERS' | 'INVITATIONS'>('USERS');
  const { invitations, createInvitation, deleteInvitation, isLoading: invitationsLoading } = useInvitations();
  const [inviteRole, setInviteRole] = useState<'ADMIN' | 'OWNER'>('OWNER');
  const [inviteEmail, setInviteEmail] = useState('');
  const [hotelName, setHotelName] = useState('');

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await authService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'USERS') {
      fetchUsers();
    }
  }, [activeTab]);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number | string) => {
      if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
          try {
              await authService.deleteUser(id);
              setUsers(users.filter(u => u.id !== id));
              toast.success('Utilisateur supprimé');
          } catch (err) {
              toast.error('Erreur lors de la suppression');
          }
      }
  };

  const toggleRole = async (user: User) => {
      const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
      try {
          const updated = await authService.updateUser(user.id, { role: newRole });
          setUsers(users.map(u => u.id === user.id ? updated : u));
          toast.success('Rôle mis à jour');
      } catch (err) {
          toast.error('Erreur lors de la mise à jour du rôle');
      }
  };

  const handleGenerateInvite = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          const invite = await createInvitation(inviteRole, inviteEmail || undefined, inviteRole === 'OWNER' ? hotelName : undefined);
          const inviteUrl = `${window.location.origin}/register?token=${invite.token}`;
          
          // Copy to clipboard
          navigator.clipboard.writeText(inviteUrl);
          toast.success('Invitation générée et lien copié !');
          setInviteEmail('');
          setHotelName('');
      } catch (err) {
          // Toast handled in context
      }
  };

  const copyInviteLink = (token: string) => {
      const inviteUrl = `${window.location.origin}/register?token=${token}`;
      navigator.clipboard.writeText(inviteUrl);
      toast.success('Lien copié dans le presse-papier');
  };

  if (isLoading && activeTab === 'USERS') return <div className="text-center py-12">Chargement des utilisateurs...</div>;

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Gestion des Utilisateurs</h1>
            <div className="flex bg-gray-100 p-1 rounded-lg">
                <button 
                    onClick={() => setActiveTab('USERS')}
                    className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${activeTab === 'USERS' ? 'bg-white shadow-sm text-[#6B5434]' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Utilisateurs
                </button>
                <button 
                    onClick={() => setActiveTab('INVITATIONS')}
                    className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${activeTab === 'INVITATIONS' ? 'bg-white shadow-sm text-[#6B5434]' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Invitations
                </button>
            </div>
       </div>

       {activeTab === 'USERS' ? (
         <>
           <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-100 flex items-center">
              <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input 
                type="text" 
                placeholder="Rechercher par nom ou email..." 
                className="flex-1 outline-none text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>

           <div className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-[#FAF6F1] text-gray-700 font-medium">
                  <tr>
                    <th className="px-6 py-4">Utilisateur</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Rôle</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                          <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3">
                                  {user.avatar ? (
                                      <img src={user.avatar.startsWith('http') ? user.avatar : `${import.meta.env.VITE_API_URL}${user.avatar}`} alt={user.name} className="w-full h-full object-cover" />
                                  ) : (
                                      <span className="text-gray-500 font-bold">{user.name.charAt(0)}</span>
                                  )}
                              </div>
                              <div>
                                  <div className="font-medium text-gray-900">{user.name}</div>
                                  <div className="text-xs text-gray-500">ID: {user.id}</div>
                              </div>
                          </div>
                      </td>
                      <td className="px-6 py-4">
                          <div className="text-gray-900">{user.email}</div>
                          <div className="text-xs text-gray-500">{user.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : user.role === 'OWNER' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                              {user.role}
                          </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button 
                            onClick={() => toggleRole(user)}
                            className="text-gray-500 hover:text-[#6B5434] font-medium text-xs border border-gray-300 px-2 py-1 rounded transition-colors"
                        >
                            {user.role === 'ADMIN' ? 'Rétrograder' : 'Promouvoir'}
                        </button>
                        <button 
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                 <div className="text-center py-12 text-gray-500">
                    Aucun utilisateur trouvé.
                 </div>
              )}
            </div>
          </div>
         </>
       ) : (
         <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Générer une Invitation</h3>
                <form onSubmit={handleGenerateInvite} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                        <select 
                            value={inviteRole}
                            onChange={(e) => setInviteRole(e.target.value as 'ADMIN' | 'OWNER')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#6B5434] focus:border-[#6B5434]"
                        >
                            <option value="OWNER">Propriétaire Hôtel (OWNER)</option>
                            <option value="ADMIN">Administrateur (ADMIN)</option>
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email du destinataire (optionnel)</label>
                        <input 
                            type="email" 
                            placeholder="invite@exemple.com"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#6B5434] focus:border-[#6B5434]"
                        />
                    </div>
                    {inviteRole === 'OWNER' && (
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'Hôtel</label>
                            <input 
                                type="text" 
                                placeholder="ex: Luxotel Sea View"
                                value={hotelName}
                                onChange={(e) => setHotelName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#6B5434] focus:border-[#6B5434]"
                            />
                        </div>
                    )}
                    <div className="flex items-end">
                        <button 
                            type="submit"
                            className="bg-[#6B5434] hover:bg-[#5B4424] text-white px-6 py-2 rounded-md font-medium shadow-sm transition-colors w-full"
                        >
                            Générer le Lien
                        </button>
                    </div>
                </form>
                <p className="mt-2 text-xs text-gray-500">Le lien sera automatiquement copié dans votre presse-papier.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-[#FAF6F1] text-gray-700 font-medium">
                            <tr>
                                <th className="px-6 py-4">Rôle</th>
                                <th className="px-6 py-4">Destinataire</th>
                                <th className="px-6 py-4">Hôtel</th>
                                <th className="px-6 py-4">Expiration</th>
                                <th className="px-6 py-4">Statut</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {invitations.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                      {invitationsLoading ? "Chargement..." : "Aucune invitation active."}
                                    </td>
                                </tr>
                            ) : (
                                [...invitations].reverse().map((inv) => (
                                    <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${inv.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                                                {inv.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{inv.email || "Tous"}</td>
                                        <td className="px-6 py-4 text-sm italic">{inv.hotelName || "-"}</td>
                                        <td className="px-6 py-4 text-xs">
                                            {inv.expiresAt ? new Date(inv.expiresAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : "Indéfinie"}
                                        </td>
                                        <td className="px-6 py-4">
                                            {inv.used ? (
                                                <span className="text-gray-400 flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                                    Utilisé
                                                </span>
                                            ) : (inv.expiresAt && new Date(inv.expiresAt) < new Date()) ? (
                                                <span className="text-red-400 italic">Expiré</span>
                                            ) : (
                                                <span className="text-green-600 font-medium">Actif</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            {!inv.used && (!inv.expiresAt || new Date(inv.expiresAt) >= new Date()) && (
                                                <button 
                                                    onClick={() => copyInviteLink(inv.token)}
                                                    className="text-[#6B5434] hover:underline text-xs font-medium"
                                                >
                                                    Copier Lien
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => deleteInvitation(inv.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
         </div>
       )}
    </div>
  );
}
