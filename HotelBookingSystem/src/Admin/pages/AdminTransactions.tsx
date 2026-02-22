import { useState, useEffect } from 'react';
import { bookingService } from '../../api/booking.service';
import type { Transaction } from '../../types';
import { Download, DollarSign, CheckCircle, Clock, XCircle, RefreshCw, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const fetchTransactions = async () => {
    try {
      const data = await bookingService.getTransactions();
      setTransactions(data);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      toast.error('Erreur lors du chargement des transactions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(t => 
    filter === 'ALL' || t.status === filter
  );

  const stats = {
    total: transactions.length,
    completed: transactions.filter(t => t.status === 'COMPLETED').length,
    pending: transactions.filter(t => t.status === 'PENDING').length,
    failed: transactions.filter(t => t.status === 'FAILED').length,
    totalRevenue: transactions
      .filter(t => t.status === 'COMPLETED')
      .reduce((acc, t) => acc + (typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount), 0)
  };

  const handleRefund = (id: string | number) => {
    if (confirm('Confirmer le remboursement ? (Simulation)')) {
      toast.success('Remboursement traité avec succès');
      // In a real app, this would call bookingService.refundTransaction(id)
      setTransactions(transactions.map(t => 
        t.id === id ? { ...t, status: 'REFUNDED' } : t
      ));
    }
  };

  if (isLoading) {
      return (
          <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#6B5434] mb-4" />
              <p className="text-gray-500">Chargement des transactions financières...</p>
          </div>
      );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestion des Transactions</h1>
          <p className="text-gray-500 text-sm mt-1">Historique et gestion des paiements en temps réel</p>
        </div>
        <button 
          onClick={() => toast.success('Exportation démarrée...')}
          className="px-4 py-2 bg-[#6B5434] hover:bg-[#5A462C] text-white rounded-lg font-medium text-sm flex items-center gap-2 transition-all shadow-sm active:scale-95"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1A1A1A] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <DollarSign className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1A1A] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Complétées</p>
              <p className="text-2xl font-black text-green-600 dark:text-green-400">{stats.completed}</p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1A1A] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">En Attente</p>
              <p className="text-2xl font-black text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <Clock className="text-yellow-600 dark:text-yellow-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1A1A] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Revenu Total</p>
              <p className="text-2xl font-black text-[#C6A87C]">{stats.totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-gray-400 uppercase font-black">MRU</p>
            </div>
            <div className="p-3 bg-[#C6A87C]/10 rounded-lg">
              <DollarSign className="text-[#C6A87C]" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 bg-white dark:bg-[#1A1A1A] p-1 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm w-fit overflow-x-auto max-w-full">
        {['ALL', 'COMPLETED', 'PENDING', 'FAILED', 'REFUNDED'].map((status) => (
          <button 
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-md text-xs font-black tracking-widest uppercase transition-all whitespace-nowrap ${
              filter === status ? 'bg-[#C6A87C] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            {status === 'ALL' ? 'Tout' : status}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-[#1A1A1A] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-[#FAF6F1] dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 font-bold border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 text-xs uppercase tracking-widest">ID</th>
                <th className="px-6 py-4 text-xs uppercase tracking-widest">Réservation</th>
                <th className="px-6 py-4 text-xs uppercase tracking-widest">Montant</th>
                <th className="px-6 py-4 text-xs uppercase tracking-widest">Méthode</th>
                <th className="px-6 py-4 text-xs uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-xs uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-xs uppercase tracking-widest">Statut</th>
                <th className="px-6 py-4 text-xs uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-gray-400">#{transaction.id}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-300 font-medium">#{transaction.booking}</td>
                  <td className="px-6 py-4 font-black text-[#C6A87C]">{transaction.amount} {transaction.currency}</td>
                  <td className="px-6 py-4">
                    <span className="text-gray-500 font-medium">
                      {transaction.method === 'CARD' ? '💳 Carte' : 
                       transaction.method === 'CASH' ? 'Espèces' : 
                       transaction.method === 'MAURIPAY' ? '📱 MauriPay' : '🏦 Virement'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      transaction.payment_type === 'FULL' || transaction.payment_type === 'FULL_PAYMENT' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {transaction.payment_type === 'FULL' || transaction.payment_type === 'FULL_PAYMENT' ? 'Complet' : 'Acompte'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium">{new Date(transaction.created_at || transaction.date || '').toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-fit ${
                      transaction.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                      transaction.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      transaction.status === 'REFUNDED' ? 'bg-purple-100 text-purple-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {transaction.status === 'COMPLETED' && <CheckCircle size={10} />}
                      {transaction.status === 'PENDING' && <Clock size={10} />}
                      {transaction.status === 'FAILED' && <XCircle size={10} />}
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      {transaction.invoice_url && (
                        <a 
                          href={transaction.invoice_url} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#6B5434] hover:underline text-xs font-black uppercase tracking-widest"
                        >
                          Facture
                        </a>
                      )}
                      {transaction.status === 'COMPLETED' && (
                        <button 
                          onClick={() => handleRefund(transaction.id)}
                          className="text-red-500 hover:text-red-600 font-black uppercase tracking-widest text-[10px] flex items-center gap-1 transition-colors"
                        >
                          <RefreshCw size={12} />
                          Rembourser
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTransactions.length === 0 && (
          <div className="text-center py-20 bg-gray-50/30 dark:bg-gray-900/10">
            <p className="text-gray-400 font-medium">Aucune transaction trouvée.</p>
          </div>
        )}
      </div>
    </div>
  );
}
