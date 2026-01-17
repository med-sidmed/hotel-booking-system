import { useState } from 'react';
import { 
  Shield, 
  Search, 
  Download,
  Info
} from 'lucide-react';
import { useAuditLogs } from '../../context/AuditLogContext';
import type { AuditLog } from '../../context/AuditLogContext';

export default function AdminAuditLogs() {
  const { logs } = useAuditLogs();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<AuditLog['category'] | 'ALL'>('ALL');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'ALL' || log.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: AuditLog['category']) => {
    const colors = {
      AUTH: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      BOOKING: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
      HOTEL: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
      ROOM: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
      REVIEW: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
      SYSTEM: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
    };
    return colors[category];
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
            <Shield className="text-[#C6A87C]" size={28} />
            Journaux d'Audit
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Suivi complet des actions critiques effectuées sur la plateforme</p>
        </div>
        <button 
          onClick={() => {
            const csv = "ID,Utilisateur,Rôle,Action,Catégorie,Détails,Date\n" + 
              logs.map(log => `${log.id},${log.userName},${log.userRole},${log.action},${log.category},${log.details},${log.timestamp}`).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('href', url);
            a.setAttribute('download', `audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
            a.click();
            window.URL.revokeObjectURL(url);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#C6A87C] text-white rounded-lg hover:bg-[#B5966A] transition-colors shadow-sm"
        >
          <Download size={18} />
          Exporter CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-[#1A1A1A] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Rechercher par utilisateur, action ou détails..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg focus:ring-2 focus:ring-[#C6A87C] dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 shrink-0 overflow-x-auto pb-2 md:pb-0">
            {(['ALL', 'AUTH', 'BOOKING', 'HOTEL', 'ROOM', 'REVIEW', 'SYSTEM'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  filterCategory === cat 
                    ? 'bg-[#C6A87C] text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat === 'ALL' ? 'Tous' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1A1A1A] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b dark:border-gray-800">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Heure</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Utilisateur</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Catégorie</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                    Aucun journal d'audit trouvé.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#C6A87C]/10 flex items-center justify-center text-[#C6A87C] font-bold text-xs">
                          {log.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold dark:text-white uppercase">{log.userName}</p>
                          <p className="text-[10px] text-gray-400 font-medium">{log.userRole}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium dark:text-gray-200">{log.action}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getCategoryColor(log.category)}`}>
                        {log.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate" title={log.details}>
                        {log.details}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 flex gap-3">
        <Info className="text-blue-500 shrink-0" size={20} />
        <div>
          <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">Informations de conformité</p>
          <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">
            Les journaux d'audit sont conservés pendant 90 jours. Ils ne peuvent pas être modifiés ou supprimés manuellement pour garantir l'imputabilité.
          </p>
        </div>
      </div>
    </div>
  );
}
