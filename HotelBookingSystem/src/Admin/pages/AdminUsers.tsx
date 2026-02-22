import { useState, useEffect } from 'react';
import type { UserProfile as User } from '../../types';
import { useInvitations } from '../../context/InvitationContext';
import { authService } from '../../api/auth.service';
import toast from 'react-hot-toast';
import { UserPlus, Search, Shield, Trash2, Copy, Link2, ChevronDown } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'USERS' | 'INVITATIONS'>('USERS');
  const { invitations, createInvitation, deleteInvitation, isLoading: invitationsLoading } = useInvitations();

  // Invitation state — only existing owners
  const [inviteEmail, setInviteEmail] = useState('');
  const [ownersList, setOwnersList] = useState<User[]>([]);

  // User creation state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'USER', phone: '' });
  const [isCreating, setIsCreating] = useState(false);

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

  const fetchOwners = async () => {
    try {
      const data = await authService.getUsers({ role: 'owner' });
      setOwnersList(data);
    } catch (err) {
      console.error('Failed to fetch owners:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (activeTab === 'INVITATIONS') {
      fetchOwners();
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
      const updated = await authService.updateUser(user.id, { role: newRole.toLowerCase() });
      setUsers(users.map(u => u.id === user.id ? { ...u, role: updated.role || newRole } : u));
      toast.success('Rôle mis à jour');
    } catch (err) {
      toast.error('Erreur lors de la mise à jour du rôle');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    setIsCreating(true);
    try {
      const created = await authService.createUser({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
        phone: newUser.phone || undefined
      });
      setUsers(prev => [created, ...prev]);
      toast.success(`Utilisateur "${created.name}" créé avec succès !`);
      setNewUser({ name: '', email: '', password: '', role: 'USER', phone: '' });
      setShowCreateForm(false);
    } catch (err: any) {
      const msg = err?.response?.data?.email?.[0] || err?.response?.data?.error || 'Erreur lors de la création';
      toast.error(msg);
    } finally {
      setIsCreating(false);
    }
  };

  const handleGenerateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) {
      toast.error('Veuillez sélectionner un propriétaire');
      return;
    }
    try {
      const invite = await createInvitation('OWNER', inviteEmail);
      const inviteUrl = `${window.location.origin}/register?token=${invite.token}`;
      navigator.clipboard.writeText(inviteUrl);
      toast.success('Invitation générée et lien copié !');
      setInviteEmail('');
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Erreur lors de la création de l\'invitation';
      toast.error(msg);
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
        <div className="flex items-center gap-3">
          {activeTab === 'USERS' && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-2 bg-[#6B5434] hover:bg-[#5B4424] text-white px-4 py-2 rounded-lg font-medium text-sm shadow-sm transition-colors"
            >
              <UserPlus size={16} />
              Créer un Utilisateur
            </button>
          )}
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
      </div>

      {activeTab === 'USERS' ? (
        <>
          {/* Create User Form */}
          {showCreateForm && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-green-200 animate-in slide-in-from-top duration-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <UserPlus size={20} className="text-[#6B5434]" />
                Créer un Nouvel Utilisateur
              </h3>
              <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                  <input 
                    type="text"
                    required
                    placeholder="Ahmed Mohamed"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input 
                    type="email"
                    required
                    placeholder="user@exemple.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
                  <input 
                    type="password"
                    required
                    minLength={6}
                    placeholder="Min. 6 caractères"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rôle *</label>
                  <div className="relative">
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent outline-none appearance-none"
                    >
                      <option value="USER">Client (USER)</option>
                      <option value="OWNER">Propriétaire (OWNER)</option>
                      <option value="ADMIN">Administrateur (ADMIN)</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input 
                    type="tel"
                    placeholder="+222 XX XX XX XX"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent outline-none"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <button 
                    type="submit"
                    disabled={isCreating}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors disabled:opacity-50"
                  >
                    {isCreating ? 'Création...' : 'Créer'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Search Bar */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-100 flex items-center">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <input 
              type="text" 
              placeholder="Rechercher par nom ou email..." 
              className="flex-1 outline-none text-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Users Table */}
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
                          className="text-gray-500 hover:text-[#6B5434] font-medium text-xs border border-gray-300 px-2 py-1 rounded transition-colors inline-flex items-center gap-1"
                        >
                          <Shield size={12} />
                          {user.role === 'ADMIN' ? 'Rétrograder' : 'Promouvoir'}
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors inline-flex"
                        >
                          <Trash2 size={16} />
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
          {/* Generate Invitation — Owner Dropdown */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Link2 size={20} className="text-[#6B5434]" />
              Inviter un Propriétaire Existant
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Sélectionnez un propriétaire (OWNER) déjà enregistré dans le système pour lui envoyer un lien d'invitation.
            </p>
            <form onSubmit={handleGenerateInvite} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Propriétaire (OWNER)</label>
                <div className="relative">
                  <select 
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C6A87C] focus:border-transparent outline-none appearance-none"
                  >
                    <option value="">— Sélectionner un propriétaire —</option>
                    {ownersList.map((owner) => (
                      <option key={owner.id} value={owner.email}>
                        {owner.name} ({owner.email})
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {ownersList.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">Aucun propriétaire trouvé. Créez d'abord un utilisateur avec le rôle OWNER.</p>
                )}
              </div>
              <div className="flex items-end">
                <button 
                  type="submit"
                  disabled={!inviteEmail}
                  className="bg-[#6B5434] hover:bg-[#5B4424] text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Générer le Lien
                </button>
              </div>
            </form>
            <p className="mt-2 text-xs text-gray-500">Le lien sera automatiquement copié dans votre presse-papier.</p>
          </div>

          {/* Invitations Table */}
          <div className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-[#FAF6F1] text-gray-700 font-medium">
                  <tr>
                    <th className="px-6 py-4">Rôle</th>
                    <th className="px-6 py-4">Destinataire</th>
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
                        <td className="px-6 py-4 font-medium">{inv.email || "Tous"}</td>
                        <td className="px-6 py-4 text-xs">
                          {inv.expiresAt ? new Date(inv.expiresAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : "Indéfinie"}
                        </td>
                        <td className="px-6 py-4">
                          {inv.used ? (
                            <span className="text-gray-400 flex items-center gap-1 text-xs">✓ Utilisé</span>
                          ) : (inv.expiresAt && new Date(inv.expiresAt) < new Date()) ? (
                            <span className="text-red-400 italic text-xs">Expiré</span>
                          ) : (
                            <span className="text-green-600 font-medium text-xs">Actif</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right space-x-3">
                          {!inv.used && (!inv.expiresAt || new Date(inv.expiresAt) >= new Date()) && (
                            <button 
                              onClick={() => copyInviteLink(inv.token)}
                              className="text-[#6B5434] hover:underline text-xs font-medium inline-flex items-center gap-1"
                            >
                              <Copy size={12} />
                              Copier Lien
                            </button>
                          )}
                          <button 
                            onClick={() => deleteInvitation(inv.id)}
                            className="text-red-600 hover:text-red-800 inline-flex"
                          >
                            <Trash2 size={14} />
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
