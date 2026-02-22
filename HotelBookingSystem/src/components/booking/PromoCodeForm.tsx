import { useState } from 'react';
import { usePromoCodes } from '../../context/PromoCodeContext';
import { Button } from '../ui/button';
import { Loader2, Ticket, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface PromoCodeFormProps {
  onSubmit: (promoCode?: string) => void;
  onBack: () => void;
  totalPrice: number;
  isLoading?: boolean;
}

export function PromoCodeForm({ onSubmit, onBack, totalPrice, isLoading }: PromoCodeFormProps) {
  const { validatePromoCode } = usePromoCodes();
  const [code, setCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const handleApplyCode = async () => {
    if (!code.trim()) return;

    setIsValidating(true);
    try {
      const result = await validatePromoCode(code, totalPrice);
      if (result.valid) {
        setAppliedPromo(result.promo);
        setDiscountAmount(result.discount || 0);
        toast.success('Code promo appliqué !');
      } else {
        toast.error(result.message);
        setAppliedPromo(null);
        setDiscountAmount(0);
      }
    } catch (err) {
      toast.error('Erreur lors de la validation du code');
    } finally {
      setIsValidating(false);
    }
  };

  const finalPrice = Math.max(0, totalPrice - discountAmount);

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm font-black text-gray-500 uppercase tracking-widest">Sous-total</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{totalPrice}€</p>
        </div>
        
        {discountAmount > 0 && (
          <div className="flex justify-between items-center mb-4 text-green-600">
            <p className="text-sm font-bold">Réduction ({appliedPromo?.code})</p>
            <p className="text-xl font-bold">-{discountAmount}€</p>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <p className="text-lg font-black text-gray-900 dark:text-white">Total à régler</p>
          <p className="text-3xl font-black text-[#6B5434] dark:text-[#C6A87C]">{finalPrice}€</p>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest">
          Code Promo (Optionnel)
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-xl outline-none focus:border-[#6B5434] transition-colors font-bold uppercase"
              placeholder="EX: SUMMER20"
              disabled={!!appliedPromo}
            />
          </div>
          <Button 
            type="button"
            onClick={handleApplyCode}
            disabled={isValidating || !code || !!appliedPromo}
            className="bg-gray-900 hover:bg-black text-white px-6 rounded-xl h-auto"
          >
            {isValidating ? <Loader2 className="animate-spin" size={20} /> : "Appliquer"}
          </Button>
        </div>
        
        {appliedPromo && (
          <p className="text-xs text-green-600 font-bold flex items-center gap-1">
            <CheckCircle2 size={14} /> Code promo "{appliedPromo.code}" actif
            <button 
              onClick={() => { setAppliedPromo(null); setCode(''); setDiscountAmount(0); }}
              className="ml-2 text-gray-400 hover:text-red-500 underline"
            >
              Retirer
            </button>
          </p>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1 py-6 rounded-2xl border-2 font-black text-gray-600 hover:bg-gray-50"
        >
          Retour
        </Button>
        <Button
          type="button"
          onClick={() => onSubmit(appliedPromo?.code)}
          disabled={isLoading}
          className="flex-1 py-6 bg-[#6B5434] hover:bg-[#5B4424] text-white rounded-2xl font-black shadow-lg hover:shadow-[#6B5434]/30"
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Confirmer"}
        </Button>
      </div>

      <p className="text-[10px] text-center text-gray-400 font-medium">
        En cliquant sur confirmer, vous acceptez nos conditions générales de vente.
      </p>
    </div>
  );
}
