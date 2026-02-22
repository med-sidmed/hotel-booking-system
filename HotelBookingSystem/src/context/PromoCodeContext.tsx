import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { hotelService } from '../api/hotel.service';

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
  validatePromoCode: (code: string, bookingValue: number) => Promise<{ 
    valid: boolean; 
    discount?: number; 
    message: string;
    promo?: any;
  }>;
}

const PromoCodeContext = createContext<PromoCodeContextType | undefined>(undefined);

export const PromoCodeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const data = await hotelService.getPromotions();
        // Map backend data to frontend interface if needed
        setPromoCodes(data.map((p: any) => ({
          ...p,
          discountType: p.discount_type,
          discountValue: p.discount_value,
          expiryDate: p.expiry_date,
          usedCount: p.used_count,
          isActive: p.is_active
        })));
      } catch (err) {
        console.error('Failed to fetch promotions:', err);
      }
    };
    fetchPromos();
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

  const validatePromoCode = async (code: string, bookingValue: number) => {
    try {
      const result = await hotelService.validatePromotion(code, bookingValue);
      return {
        valid: result.valid,
        discount: result.discount,
        message: result.message,
        promo: result.promotion
      };
    } catch (err: any) {
      return {
        valid: false,
        message: err.response?.data?.error || 'Erreur lors de la validation du code promo'
      };
    }
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
