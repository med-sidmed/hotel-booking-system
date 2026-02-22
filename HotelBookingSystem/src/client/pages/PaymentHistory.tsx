import { useState, useEffect } from 'react';
import { bookingService } from '../../api/booking.service';
import type { Transaction } from '../../types';
import { Download, CreditCard, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PaymentHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const data = await bookingService.getTransactions();
      setTransactions(data.filter(t => t.status !== 'FAILED')); // Optional: Hide failed ones or show them differently
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      toast.error('Erreur lors du chargement de l\'historique');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#6B5434] mb-4" />
        <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Chargement de vos factures...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Historique de Paiement</h1>
        <p className="text-gray-500 text-sm mt-1">Gérez vos transactions et téléchargez vos justificatifs fiscaux</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all group border-l-4 border-l-[#C6A87C]">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-6 flex-1">
                <div className="p-4 bg-gray-50 rounded-xl group-hover:bg-[#C6A87C]/10 transition-colors">
                  <CreditCard className="text-[#C6A87C]" size={28} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs">Réf. #{transaction.id}</h3>
                    {getStatusIcon(transaction.status)}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${
                      transaction.status === 'COMPLETED' ? 'bg-green-50 text-green-700' :
                      transaction.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <div>
                      <p className="mb-1 text-gray-300">Réservation</p>
                      <p className="text-gray-600">REQ-{transaction.bookingId || transaction.booking}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-gray-300">Méthode</p>
                      <p className="text-gray-600">{getMethodLabel(transaction.method)}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-gray-300">Date</p>
                      <p className="text-gray-600">{transaction.date || String(transaction.created_at).split('T')[0]}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-2xl font-black text-[#6B5434]">{Number(transaction.amount).toLocaleString()} <span className="text-xs">{transaction.currency}</span></p>
                {(transaction.invoiceUrl || transaction.invoice_url) && (
                  <button className="mt-4 px-5 py-2.5 bg-gray-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-black transition-all shadow-lg active:scale-95">
                    <Download size={14} />
                    Facture PDF
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {transactions.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <CreditCard className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 font-black uppercase tracking-widest text-sm">Aucun historique</p>
          <p className="text-gray-400 text-[10px] font-bold mt-2">Vous n'avez pas encore effectué de transactions sur notre plateforme.</p>
        </div>
      )}
    </div>
  );
}
