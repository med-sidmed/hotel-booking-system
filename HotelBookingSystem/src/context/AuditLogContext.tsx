import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: 'ADMIN' | 'OWNER' | 'USER';
  action: string;
  category: 'AUTH' | 'BOOKING' | 'HOTEL' | 'ROOM' | 'REVIEW' | 'SYSTEM';
  details: string;
  timestamp: string;
  ipAddress?: string;
}

interface AuditLogContextType {
  logs: AuditLog[];
  addLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  getLogsByCategory: (category: AuditLog['category']) => AuditLog[];
}

const AuditLogContext = createContext<AuditLogContextType | undefined>(undefined);

export const AuditLogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    const storedLogs = localStorage.getItem('luxotel_audit_logs');
    if (storedLogs) {
      setLogs(JSON.parse(storedLogs));
    } else {
      // Mock initial logs
      const initialLogs: AuditLog[] = [
        {
          id: 'log-1',
          userId: 'admin-1',
          userName: 'Admin Luxotel',
          userRole: 'ADMIN',
          action: 'Connexion au système',
          category: 'AUTH',
          details: 'Session administrateur démarrée',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'log-2',
          userId: 'owner-1',
          userName: 'Jean Propriétaire',
          userRole: 'OWNER',
          action: 'Mise à jour hôtel',
          category: 'HOTEL',
          details: 'Modification des informations de l\'Hôtel Palace',
          timestamp: new Date(Date.now() - 7200000).toISOString()
        }
      ];
      setLogs(initialLogs);
      localStorage.setItem('luxotel_audit_logs', JSON.stringify(initialLogs));
    }
  }, []);

  const addLog = (logData: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      ...logData,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    setLogs(prev => {
      const updatedLogs = [newLog, ...prev].slice(0, 1000); // Keep last 1000 logs
      localStorage.setItem('luxotel_audit_logs', JSON.stringify(updatedLogs));
      return updatedLogs;
    });
  };

  const getLogsByCategory = (category: AuditLog['category']) => {
    return logs.filter(log => log.category === category);
  };

  return (
    <AuditLogContext.Provider value={{ logs, addLog, getLogsByCategory }}>
      {children}
    </AuditLogContext.Provider>
  );
};

export const useAuditLogs = () => {
  const context = useContext(AuditLogContext);
  if (context === undefined) {
    throw new Error('useAuditLogs must be used within an AuditLogProvider');
  }
  return context;
};
