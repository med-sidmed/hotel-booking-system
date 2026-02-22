import React, { useState } from 'react';

interface PaymentData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
}

interface PaymentFormProps {
  onSubmit: (data: PaymentData) => void;
  onBack: () => void;
  totalPrice: number;
  isLoading?: boolean;
}

export function PaymentForm({ onSubmit, onBack, totalPrice, isLoading }: PaymentFormProps) {
  const [formData, setFormData] = useState<PaymentData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-md mb-4">
        <p className="text-sm text-gray-600">Montant total à payer</p>
        <p className="text-2xl font-bold text-[#6B5434]">{totalPrice}€</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom sur la carte</label>
          <input
            type="text"
            name="cardName"
            value={formData.cardName}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#6B5434]"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de carte</label>
          <input
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            required
            maxLength={19}
            className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#6B5434]"
            placeholder="0000 0000 0000 0000"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date d'expiration</label>
            <input
              type="text"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              required
              maxLength={5}
              className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#6B5434]"
              placeholder="MM/YY"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
            <input
              type="text"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              required
              maxLength={3}
              className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#6B5434]"
              placeholder="123"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 font-medium"
          >
            Retour
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-[#6B5434] text-white rounded hover:bg-[#5B4424] font-medium disabled:opacity-50"
          >
            {isLoading ? 'Traitement...' : `Payer ${totalPrice}€`}
          </button>
        </div>
      </form>
    </div>
  );
}
