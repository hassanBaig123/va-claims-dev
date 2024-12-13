'use client';
import React, { createContext, useContext, ReactNode, useCallback } from 'react';

interface SessionContextType {
  addSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSessionContext must be used within a SessionProvider');
  }
  return context;
};

export const SessionProvider: React.FC<{children: ReactNode, onAddSession: () => void}> = ({ children, onAddSession }) => {
  const addSession = useCallback(() => {
    onAddSession();
  }, [onAddSession]);

  return (
    <SessionContext.Provider value={{ addSession }}>
      {children}
    </SessionContext.Provider>
  );
};