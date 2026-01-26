import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role: 'ADMIN' | 'OWNER' | 'USER') => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user', e);
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, role: 'ADMIN' | 'OWNER' | 'USER') => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockUser: UserProfile = {
      id: role === 'ADMIN' ? 'admin-1' : role === 'OWNER' ? 'owner-1' : 'client-1',
      name: role === 'ADMIN' ? 'Administrateur' : role === 'OWNER' ? 'Propriétaire Hôtel' : 'Sophie Martin',
      email: email,
      password: 'password', // Not used for security but for mock consistency
      role: role,
      avatar: `https://i.pravatar.cc/150?u=${email}`,
      phone: '+222 40 00 00 00',
      loyaltyPoints: 1250,
      preferences: {
        language: 'fr',
        currency: 'MRU',
        notifications: true
      }
    };

    setUser(mockUser);
    localStorage.setItem('auth_user', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    // Clear storage to force a clean state
    window.location.href = '/';
  };

  const updateUser = (data: Partial<UserProfile>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
