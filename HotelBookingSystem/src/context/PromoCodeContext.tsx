import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface PromoCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minBookingValue?: number;
  expiryDate: string;
  maxUses?: number;
  usedCount: number;
  isActive: boolean;
}

interface PromoCodeContextType {
  promoCodes: PromoCode[];
  addPromoCode: (promo: Omit<PromoCode, 'id' | 'usedCount' | 'isActive'>) => void;
  deletePromoCode: (id: string) => void;
  togglePromoCode: (id: string) => void;
  validatePromoCode: (code: string, bookingValue: number) => { 
    valid: boolean; 
    discount?: number; 
    message: string;
    promo?: PromoCode;
  };
}

const PromoCodeContext = createContext<PromoCodeContextType | undefined>(undefined);

export const PromoCodeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);

  useEffect(() => {
    const storedPromos = localStorage.getItem('luxotel_promo_codes');
    if (storedPromos) {
      setPromoCodes(JSON.parse(storedPromos));
    } else {
      // Initial mock promo codes
      const initialPromos: PromoCode[] = [
        {
          id: 'promo-1',
          code: 'LUXE10',
          discountType: 'percentage',
          discountValue: 10,
          expiryDate: '2025-12-31',
          usedCount: 5,
          isActive: true
        },
        {
          id: 'promo-2',
          code: 'WELCOME50',
          discountType: 'fixed',
          discountValue: 50,
          minBookingValue: 200,
          expiryDate: '2025-06-30',
          usedCount: 12,
          isActive: true
        }
      ];
      setPromoCodes(initialPromos);
      localStorage.setItem('luxotel_promo_codes', JSON.stringify(initialPromos));
    }
  }, []);

  const addPromoCode = (promoData: Omit<PromoCode, 'id' | 'usedCount' | 'isActive'>) => {
    const newPromo: PromoCode = {
      ...promoData,
      id: `promo-${Date.now()}`,
      usedCount: 0,
      isActive: true
    };

    setPromoCodes(prev => {
      const updated = [...prev, newPromo];
      localStorage.setItem('luxotel_promo_codes', JSON.stringify(updated));
      return updated;
    });
  };

  const deletePromoCode = (id: string) => {
    setPromoCodes(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem('luxotel_promo_codes', JSON.stringify(updated));
      return updated;
    });
  };

  const togglePromoCode = (id: string) => {
    setPromoCodes(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p);
      localStorage.setItem('luxotel_promo_codes', JSON.stringify(updated));
      return updated;
    });
  };

  const validatePromoCode = (code: string, bookingValue: number) => {
    const promo = promoCodes.find(p => p.code.toUpperCase() === code.toUpperCase());

    if (!promo) {
      return { valid: false, message: 'Code promo invalide' };
    }

    if (!promo.isActive) {
      return { valid: false, message: 'Ce code promo n\'est plus actif' };
    }

    if (new Date(promo.expiryDate) < new Date()) {
      return { valid: false, message: 'Ce code promo a expiré' };
    }

    if (promo.minBookingValue && bookingValue < promo.minBookingValue) {
      return { 
        valid: false, 
        message: `Montant minimum de réservation requis : ${promo.minBookingValue}€` 
      };
    }

    if (promo.maxUses && promo.usedCount >= promo.maxUses) {
      return { valid: false, message: 'Ce code promo a atteint sa limite d\'utilisation' };
    }

    let discount = 0;
    if (promo.discountType === 'percentage') {
      discount = (bookingValue * promo.discountValue) / 100;
    } else {
      discount = promo.discountValue;
    }

    return { 
      valid: true, 
      discount, 
      message: 'Code promo appliqué avec succès !',
      promo
    };
  };

  return (
    <PromoCodeContext.Provider value={{ promoCodes, addPromoCode, deletePromoCode, togglePromoCode, validatePromoCode }}>
      {children}
    </PromoCodeContext.Provider>
  );
};

export const usePromoCodes = () => {
  const context = useContext(PromoCodeContext);
  if (context === undefined) {
    throw new Error('usePromoCodes must be used within a PromoCodeProvider');
  }
  return context;
};
