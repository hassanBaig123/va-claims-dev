'use client'
import React, { useState, useEffect, useRef } from 'react';
import { StatusUpdate, TaskCallback, Update, useSwarm } from '../lib/providers/swarm-provider';
import SpriteText from 'three-spritetext';
import dynamic from 'next/dynamic';
import { createClient } from '@/utils/supabase/client';
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider';
import { ProcessState } from '@/models/local/types';
import { toast } from './ui/use-toast';

const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), { ssr: false });

interface Node {
  id: string;
  name: string;
  color?: string;
}

interface Link {
  source: string;
  target: string;
}

export default function SessionMonitor() {
  const { subscribeToSession, unsubscribeFromSession, authenticateSession, setUpdateHandler } = useSwarm();
  const [graphData, setGraphData] = useState<{ nodes: Node[]; links: Link[] }>({ nodes: [], links: [] });
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [processState, setProcessState] = useState<ProcessState>('DISCONNECTED');
  const sessionIdRef = useRef<string | null>(null);
  const taskIdRef = useRef<string | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { user } = useSupabaseUser();


  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if(!user) return;

    //console.log('Setting up immediate update handler...');
    const immediateUpdateHandler = async (update: Update) => {
        //console.log('Immediate update:', update);
        switch (update.type) {
        case 'status':
            console.log('Status:', update);
            await handleSocketStatusMessage(update);
            break;
        case 'error':
            handleSocketErrorMessage(update.sessionId, update.error);
            break;
        case 'session':
            handleSocketSessionMessage(update.sessionId, update);
            break;
        case 'task':
            handleSocketTaskMessage(update.sessionId, update);
            break;
        default:
            handleSocketUnknownMessage(update.sessionId, update);
            break;
        }
    };

    // Set the update handler to the immediateUpdateHandler
    setUpdateHandler(immediateUpdateHandler);

    return () => 
    {
      setUpdateHandler(() => {});
    }
  }, [user]);

  const handleSocketTaskMessage = (_: string, eventData: TaskCallback) => {
    const { task_id, session_id, response } = eventData;
    console.log('Task:', eventData);
    console.log('Current Task_id for response:', task_id, 'Current set TaskId:', taskIdRef.current);
    console.log('Current Session_id for response:', session_id, 'Current set SessionId:', sessionIdRef.current);
    
    if (task_id === taskIdRef.current && session_id === sessionIdRef.current) {
      const parsed_response = JSON.parse(response);
        console.log('Received new data:', parsed_response); // Additional debug log
    }
  };

  const handleSocketSessionMessage = (sessionId: string, eventData: any) => {
    console.log('Session:', eventData);
  };

  const handleSocketErrorMessage = (sessionId: string, eventData: any) => {
      console.error('Error:', eventData.error);
  };

  const handleSocketUnknownMessage = (sessionId: string, eventData: any) => {
      try {
          console.error('Unknown status:', JSON.stringify(eventData));
      } catch (error) {
          console.error('Could not stringify socket message:', error);
          console.error('Event Data:', eventData);
      }
  };

  /// Handle the status message from the server, required for the initial connection and retrieving the session id
  const handleSocketStatusMessage = async (eventData: StatusUpdate) => {
    if(!user) return;
    if ('status' in eventData) {
        switch(eventData.status) {
            case 'CONNECTED':
                setSessionId(eventData.session_id);
                sessionIdRef.current = eventData.session_id;
                handleProcessStateChange(eventData.session_id, 'CONNECTED');
                authenticateSession(user.id, eventData.session_id)
                break;
            case 'READY':
                if(!sessionIdRef.current) return;
                subscribeToSession(user.id, sessionIdRef.current);
                console.log('Subscribing ', user.id, 'to session:', sessionIdRef.current);
                handleProcessStateChange(sessionIdRef.current, 'READY');
                break;
            case 'JOINED':
                console.log('Success:', eventData.status);
                handleProcessStateChange(eventData.session_id, 'JOINED');
                break;
            case 'SUBSCRIBED':
                if(!sessionIdRef.current) return;
                console.log('Success:', eventData.status);
                handleProcessStateChange(sessionIdRef.current, 'SUBSCRIBED');
                break;
            case 'LEFT':
                console.log('New task started:', eventData.status);
                handleProcessStateChange(eventData.session_id, 'LEFT');
                break;
            case 'DISCONNECTED':
                console.log('New task started:', eventData.status);
                handleProcessStateChange(eventData.session_id, 'DISCONNECTED');
                break;
        }
    } else {
        console.error('Status message does not contain a status:', eventData);
    }
};

const handleProcessStateChange = (sessionId: string, newState: ProcessState, message?: any) => {
    setProcessState(newState);
    toast({
      title: 'Process State Changed',
      description: (
        <>
            <pre>{`Process state changed to ${newState} for session ${sessionId}`}</pre>
            <pre>{`Message: ${message}`}</pre>
        </>
      )
    });
};

  useEffect(() => {

    if (sessionId && user?.id) {
      subscribeToSession(user?.id, sessionId);

      setUpdateHandler(update => {
        if (update.type === 'task' && update.response.status === 'completed') {
          const newNodes = update.response.task.map((task: { id: string; name: string; }) => ({ id: task.id, name: task.name }));
          const newLinks = update.response.task.map((task: { id: string; }) => ({ source: 'root', target: task.id }));
          setGraphData(prevData => ({
            nodes: [...prevData.nodes, ...newNodes],
            links: [...prevData.links, ...newLinks]
          }));
        }
      });

      return () => {
        unsubscribeFromSession(user?.id, sessionId);
      };
    }
  }, [sessionId]);

  const handleWebSocketMessage = (event: MessageEvent) => {
    const eventData = JSON.parse(event.data);
    if (eventData.status) {
      handleSocketStatusMessage(eventData);
    } else if (eventData.msg_type) {
      handleSocketSwarmMessage(eventData);
    }
  };

  const handleSocketSwarmMessage = (eventData: any) => {
    if (eventData.msg_type === 'new_task') {
      const newNode = { id: eventData.task_id, name: eventData.task_name };
      const newLink = { source: 'root', target: eventData.task_id };
      setGraphData(prevData => ({
        nodes: [...prevData.nodes, newNode],
        links: [...prevData.links, newLink]
      }));
    }
  };

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <ForceGraph3D
        graphData={graphData}
        nodeAutoColorBy="group"
        nodeThreeObject={(node: { name: string | undefined; color: string; }) => {
          const sprite = new SpriteText(node.name);
          sprite.color = node.color;
          sprite.textHeight = 8;
          return sprite;
        }}
        onNodeClick={(node: { id?: string | number; name?: string; color?: string; x?: number; y?: number; z?: number; vx?: number; vy?: number; vz?: number; fx?: number; fy?: number; fz?: number; }) => {
          console.log('Node clicked:', node);
        }}
      />
    </div>
  );
};
