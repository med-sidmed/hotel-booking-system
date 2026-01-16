import { useState } from 'react';
import type { User } from '../../types/User';

// Mock Users Data
const mockUsers: User[] = [
    { id: 1, name: "Sophie Martin", email: "sophie.martin@example.com", phone: "+33 6 12 34 56 78", password: "hash", role: "USER", image: "https://i.pravatar.cc/150?u=sophie" },
    { id: 2, name: "Admin Principal", email: "admin@pakvista.com", phone: "+33 6 98 76 54 32", password: "hash", role: "ADMIN", image: "https://i.pravatar.cc/150?u=admin" },
    { id: 3, name: "Pierre Dupont", email: "pierre.dupont@example.com", phone: "+33 6 11 22 33 44", password: "hash", role: "USER" },
    { id: 4, name: "Marie Curie", email: "marie.curie@example.com", phone: "+33 6 55 44 33 22", password: "hash", role: "USER", image: "https://i.pravatar.cc/150?u=marie" },
];

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number | string) => {
      if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
          setUsers(users.filter(u => u.id !== id));
      }
  };

  const toggleRole = (id: number | string) => {
      setUsers(users.map(u => {
          if (u.id === id) {
              return { ...u, role: u.role === 'ADMIN' ? 'USER' : 'ADMIN' };
          }
          return u;
      }));
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Gestion des Utilisateurs</h1>
            <button className="bg-[#6B5434] hover:bg-[#5B4424] text-white px-4 py-2 rounded-md font-medium flex items-center shadow-sm transition-colors">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                Ajouter un Utilisateur
            </button>
       </div>

       {/* Search Filter */}
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
                              {user.image ? (
                                  <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
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
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {user.role}
                      </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                        onClick={() => toggleRole(user.id)}
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
    </div>
  );
}
