import { mockTransactions } from '../../data/mockData';
import { Download, CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function PaymentHistory() {
  const userId = 101;
  const userTransactions = mockTransactions.filter(t => t.userId === userId);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'PENDING':
        return <Clock className="text-yellow-600" size={20} />;
      case 'FAILED':
      case 'REFUNDED':
        return <XCircle className="text-red-600" size={20} />;
      default:
        return null;
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'CARD':
        return 'Carte Bancaire';
      case 'CASH':
        return 'Espèces';
      case 'BANK_TRANSFER':
        return 'Virement Bancaire';
      default:
        return method;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Historique des Paiements</h1>
        <p className="text-gray-500 text-sm mt-1">Consultez vos transactions et factures</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {userTransactions.map((transaction) => (
          <div key={transaction.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 bg-[#C6A87C]/10 rounded-lg">
                  <CreditCard className="text-[#C6A87C]" size={24} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-gray-800">Transaction {transaction.id}</h3>
                    {getStatusIcon(transaction.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      transaction.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                      transaction.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-600">
                      <span className="font-medium">Réservation:</span> {transaction.bookingId}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Méthode:</span> {getMethodLabel(transaction.method)}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Type:</span> {transaction.type === 'DEPOSIT' ? 'Acompte (30%)' : 'Paiement Complet'}
                    </p>
                    <p className="text-gray-400 text-xs mt-2">{transaction.date}</p>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold text-[#C6A87C]">{transaction.amount} {transaction.currency}</p>
                {transaction.invoiceUrl && (
                  <button className="mt-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
                    <Download size={16} />
                    Facture
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {userTransactions.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500">Aucune transaction trouvée.</p>
        </div>
      )}
    </div>
  );
}
