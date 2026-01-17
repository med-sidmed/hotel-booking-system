import { useState } from 'react';
import { mockTransactions } from '../../data/mockData';
import { Download, DollarSign, CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react';

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [filter, setFilter] = useState('ALL');

  const filteredTransactions = transactions.filter(t => 
    filter === 'ALL' || t.status === filter
  );

  const stats= {
    total: transactions.length,
    completed: transactions.filter(t => t.status === 'COMPLETED').length,
    pending: transactions.filter(t => t.status === 'PENDING').length,
    failed: transactions.filter(t => t.status === 'FAILED').length,
    totalRevenue: transactions
      .filter(t => t.status === 'COMPLETED')
      .reduce((acc, t) => acc + t.amount, 0)
  };

  const handleRefund = (id: string) => {
    if (confirm('Confirmer le remboursement ?')) {
      setTransactions(transactions.map(t => 
        t.id === id ? { ...t, status: 'REFUNDED' } : t
      ));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Transactions</h1>
          <p className="text-gray-500 text-sm mt-1">Historique et gestion des paiements</p>
        </div>
        <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm">
          <Download size={16} />
          Export Transactions
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <DollarSign className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Complétées</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">En Attente</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Revenu Total</p>
              <p className="text-2xl font-bold text-[#C6A87C]">{stats.totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-gray-400">MRU</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <DollarSign className="text-[#C6A87C]" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm w-fit">
        {['ALL', 'COMPLETED', 'PENDING', 'FAILED', 'REFUNDED'].map((status) => (
          <button 
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              filter === status ? 'bg-[#C6A87C] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {status === 'ALL' ? 'Tout' : status}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">ID Transaction</th>
                <th className="px-6 py-4">Réservation</th>
                <th className="px-6 py-4">Montant</th>
                <th className="px-6 py-4">Méthode</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-medium text-gray-900">{transaction.id}</td>
                  <td className="px-6 py-4 text-gray-600">{transaction.bookingId}</td>
                  <td className="px-6 py-4 font-bold text-[#C6A87C]">{transaction.amount} {transaction.currency}</td>
                  <td className="px-6 py-4">
                    <span className="text-gray-700">
                      {transaction.method === 'CARD' ? '💳 Carte' : 
                       transaction.method === 'CASH' ? '💵 Espèces' : '🏦 Virement'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      transaction.type === 'FULL_PAYMENT' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {transaction.type === 'FULL_PAYMENT' ? 'Complet' : 'Acompte'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{transaction.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                      transaction.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                      transaction.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      transaction.status === 'REFUNDED' ? 'bg-purple-100 text-purple-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {transaction.status === 'COMPLETED' && <CheckCircle size={12} />}
                      {transaction.status === 'PENDING' && <Clock size={12} />}
                      {transaction.status === 'FAILED' && <XCircle size={12} />}
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {transaction.invoiceUrl && (
                        <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">
                          Facture
                        </button>
                      )}
                      {transaction.status === 'COMPLETED' && (
                        <button 
                          onClick={() => handleRefund(transaction.id)}
                          className="text-red-600 hover:text-red-700 text-xs font-medium flex items-center gap-1"
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
      </div>

      {filteredTransactions.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500">Aucune transaction trouvée.</p>
        </div>
      )}
    </div>
  );
}
