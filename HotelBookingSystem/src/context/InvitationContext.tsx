import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Invitation } from '../types';
import { authService } from '../api/auth.service';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface InvitationContextType {
  invitations: Invitation[];
  isLoading: boolean;
  createInvitation: (role: 'ADMIN' | 'OWNER', email?: string, hotelName?: string) => Promise<Invitation>;
  deleteInvitation: (id: string | number) => Promise<void>;
  refreshInvitations: () => Promise<void>;
  validateToken: (token: string) => Promise<Invitation | undefined>;
  markInvitationAsUsed: (token: string) => Promise<void>;
}

const InvitationContext = createContext<InvitationContextType | undefined>(undefined);

export const InvitationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchInvitations = async () => {
    if (!isAuthenticated || user?.role !== 'ADMIN') return;
    setIsLoading(true);
    try {
      const data = await authService.getInvitations();
      // Map backend snake_case to frontend camelCase
      const mappedData = data.map((inv: any) => ({
        ...inv,
        createdAt: inv.created_at,
        expiresAt: inv.expires_at,
        used: inv.used || false,
        hotelName: inv.hotel_name
      }));
      setInvitations(mappedData);
    } catch (err) {
      console.error('Failed to fetch invitations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === 'ADMIN') {
      fetchInvitations();
    } else {
      setInvitations([]);
    }
  }, [isAuthenticated, user?.role]);

  const createInvitation = async (role: 'ADMIN' | 'OWNER', email?: string, hotelName?: string): Promise<Invitation> => {
    try {
      const newInv = await authService.createInvitation({ 
        role: role.toLowerCase(), 
        email, 
        hotel_name: hotelName 
      });
      const mapped = {
        ...newInv,
        createdAt: newInv.created_at,
        expiresAt: newInv.expires_at,
        used: newInv.used || false,
        hotelName: newInv.hotel_name
      };
      setInvitations(prev => [...prev, mapped]);
      return mapped;
    } catch (err) {
      toast.error('Erreur lors de la création de l\'invitation');
      throw err;
    }
  };

  const deleteInvitation = async (id: string | number) => {
    try {
      await authService.deleteInvitation(id);
      setInvitations(prev => prev.filter(inv => inv.id !== id));
      toast.success('Invitation supprimée');
    } catch (err) {
      toast.error('Erreur lors de la suppression');
      throw err;
    }
  };
  
  const validateToken = async (token: string): Promise<Invitation | undefined> => {
    try {
        const data = await authService.validateInvitation(token);
        return {
            ...data,
            createdAt: data.created_at,
            expiresAt: data.expires_at,
            used: data.used,
            hotelName: data.hotel_name
        } as Invitation;
    } catch (err) {
        console.error('Token validation failed:', err);
        return undefined;
    }
  };

  const markInvitationAsUsed = async (token: string) => {
    try {
        await authService.markInvitationAsUsed(token);
        // Also update local state if we have it
        setInvitations(prev => prev.map(inv => 
          inv.token === token ? { ...inv, used: true } : inv
        ));
    } catch (err) {
        console.error('Failed to mark invitation as used:', err);
    }
  };

  return (
    <InvitationContext.Provider value={{ 
      invitations, 
      isLoading,
      createInvitation, 
      deleteInvitation,
      refreshInvitations: fetchInvitations,
      validateToken,
      markInvitationAsUsed
    }}>
      {children}
    </InvitationContext.Provider>
  );
};

export const useInvitations = () => {
  const context = useContext(InvitationContext);
  if (context === undefined) {
    throw new Error('useInvitations must be used within an InvitationProvider');
  }
  return context;
};
