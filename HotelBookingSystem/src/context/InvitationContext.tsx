import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Invitation } from '../types';

interface InvitationContextType {
  invitations: Invitation[];
  createInvitation: (role: 'ADMIN' | 'OWNER', email?: string) => Invitation;
  validateToken: (token: string) => Invitation | null;
  markInvitationAsUsed: (token: string) => void;
  deleteInvitation: (id: string) => void;
}

const InvitationContext = createContext<InvitationContextType | undefined>(undefined);

export const InvitationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('luxotel_invitations');
    if (stored) {
      setInvitations(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('luxotel_invitations', JSON.stringify(invitations));
  }, [invitations]);

  const createInvitation = (role: 'ADMIN' | 'OWNER', email?: string): Invitation => {
    const newInvitation: Invitation = {
      id: `INV-${Date.now()}`,
      token: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      role,
      email,
      used: false,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    };

    setInvitations(prev => [...prev, newInvitation]);
    return newInvitation;
  };

  const validateToken = (token: string): Invitation | null => {
    const invite = invitations.find(i => i.token === token);
    if (!invite) return null;
    if (invite.used) return null;
    if (new Date(invite.expiresAt) < new Date()) return null;
    return invite;
  };

  const markInvitationAsUsed = (token: string) => {
    setInvitations(prev => prev.map(inv => 
      inv.token === token ? { ...inv, used: true } : inv
    ));
  };

  const deleteInvitation = (id: string) => {
    setInvitations(prev => prev.filter(inv => inv.id !== id));
  };

  return (
    <InvitationContext.Provider value={{ 
      invitations, 
      createInvitation, 
      validateToken, 
      markInvitationAsUsed,
      deleteInvitation
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
