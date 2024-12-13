'use client';
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { io as ClientIO } from 'socket.io-client';
import { useSupabaseUser } from './supabase-user-provider';

export interface MessageUpdate {
  type: 'message';
  sessionId: string;
  message: string;
  msg_type: string;
};

export interface StatusUpdate {
  type: 'status';
  session_id: string;
  status: string;
  message: string;
};

export interface ErrorUpdate {
  type: 'error';
  sessionId: string;
  error: string;
};

export interface Task {
  target: string;
  context: any;
};

export interface TaskMessage {
  id: string;
  name: string;
  description: string;
  assignee: string;
  parameters?: any;
  set_function_call?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'failed';
  context: any;
};

export interface TaskCallback {
  type: 'task';
  session_id: string;
  task_id: string;
  response: any;
};

export type Update = MessageUpdate | StatusUpdate | ErrorUpdate | TaskCallback | any;

type SwarmContextType = {
  subscribeToSession: (userId: string, sessionId: string) => void;
  unsubscribeFromSession: (userId: string, sessionId: string) => void;
  setUpdateHandler: (handler: (update: any) => void) => void;
  authenticateSession: (userId: string, sessionId: string) => void;
  // Add a function to send messages to the server
  sendMessage: (userId: string, sessionId: string, message: string, msg_type: string) => void;
  sendCallback: (userId: string, sessionId: string, task_id: string, status: string, callback: TaskCallback) => void;
  sendError: (userId: string, sessionId: string, error: string) => void;
  sendTask: (sessionId: string, task: TaskMessage) => void;
};

const SwarmContext = createContext<SwarmContextType | undefined>(undefined);

export const useSwarm = () => {
  const context = useContext(SwarmContext);
  if (context === undefined) {
    throw new Error('useSwarm must be used within a SwarmProvider');
  }
  return context;
};

export const SwarmProvider: React.FC<{ children: React.ReactNode}> = ({ children }) => {
  const currentSocket = useRef<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [updateHandler, setUpdateHandler] = useState<(update: Update) => void>(() => null);

  

  useEffect(() => {

    if(updateHandler === null) {
      console.error('updateHandler is not set');
      return;
    }
    // Ensure that the NEXT_PUBLIC_EXPRESS_SERVER_URL environment variable is set correctly
    // It should include the protocol, hostname, and port (e.g., http://localhost:3001)
    const expressServerUrl = process.env.NEXT_PUBLIC_EXPRESS_SERVER_URL;
    if (!expressServerUrl) {
      console.error('NEXT_PUBLIC_EXPRESS_SERVER_URL is not set in environment variables');
      return;
    }

    let socketInstance = currentSocket.current;

    if(!isConnected) {
      // Initialize the Socket.IO client with the correct server URL and path
      const socketInstance = new (ClientIO as any)(
        process.env.NEXT_PUBLIC_EXPRESS_SERVER_URL!,
        {
          path: '/socket.io',
        }
      );

      currentSocket.current = socketInstance;

      socketInstance.on('connect', () => {
        setIsConnected(true);
        console.log('Connected to server');
        socketInstance.on('update', (update: Update) => {
          console.log('Received update:', update);
          updateHandler(update);
        });
    
        socketInstance.on('status', (status: StatusUpdate) => {
          console.log('Received status update:', status);
          updateHandler(status);
        });
      });
    }

    return () => {
      if (currentSocket.current) {
        setIsConnected(false);
        console.log('Disconnecting from server');
        (currentSocket.current as any).disconnect();
      }
    };
  }, [setUpdateHandler, updateHandler]);

  const subscribeToSession = (userId: string, sessionId: string) => {
    if (currentSocket.current) {
      (currentSocket.current as any)?.emit('subscribe', { userId, sessionId });
    } else {
      console.error("Socket is not initialized.");
    }
  };

  const authenticateSession = (userId: string, sessionId: string) => {
    if (currentSocket.current) {
      (currentSocket.current as any)?.emit('auth', { userId, sessionId });
    } else {
      console.error("Socket is not initialized.");
    }
  };

  const unsubscribeFromSession = (userId: string, sessionId: string) => {
    if (currentSocket.current) {
      (currentSocket.current as any)?.emit('unsubscribe', { userId, sessionId });
    } else {
      console.error("Socket is not initialized.");
    }
  };

  // Implement the sendMessage function
  const sendMessage = (userId: string, sessionId: string, message: string, msg_type: string) => {
    if (currentSocket.current) {
      (currentSocket.current as any)?.emit('message', { userId, sessionId, message, msg_type });
    } else {
      console.error("Socket is not initialized.");
    }
  };

  // Implement the sendCallback function
  const sendCallback = (userId: string, sessionId: string, task_id: string, status: string, callback: TaskCallback) => {
    if (currentSocket.current) {
      (currentSocket.current as any)?.emit('callback', { userId, sessionId, task_id, status, callback });
    } else {
      console.error("Socket is not initialized.");
    }
  };

  // Implement the sendError function
  const sendError = (userId: string, sessionId: string, error: string) => {
    if (currentSocket.current) {
      (currentSocket.current as any)?.emit('error', { userId, sessionId, error });
    } else {
      console.error("Socket is not initialized.");
    }
  };

  // Implement the sendTask function
  const sendTask = (sessionId: string, task: TaskMessage) => {
    console.log('Sending Task:', task);
    if (currentSocket.current) {
      (currentSocket.current as any)?.emit('task', { sessionId, task });
    } else {
      console.error("Socket is not initialized.");
    }
  };


  // Implement the setUpdateHandler function
  const contextValue = useMemo(() => ({
    subscribeToSession,
    unsubscribeFromSession,
    authenticateSession,
    sendMessage,
    sendCallback,
    sendError,
    sendTask,
    setUpdateHandler: (handler: (update: Update) => void) => setUpdateHandler(() => handler), // Wrap the handler to ensure function identity stability
  }), [subscribeToSession, unsubscribeFromSession]);

  return (
    <SwarmContext.Provider value={contextValue}>
      {children}
    </SwarmContext.Provider>
  );
};