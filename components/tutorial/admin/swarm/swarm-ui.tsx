'use client';
import React, { useEffect, useState, createContext } from "react"
import { Button } from "@/components/ui/button"
import { SessionMessages } from "./session-messages"
import { Input } from "@/components/ui/input"
import { ArrowBigRight, PlusIcon } from "lucide-react"
import { Message, ProcessState, SwarmSession } from "@/models/local/types"
import { useSwarmSessions } from "@/lib/hooks/use-swarm-sessions"
import { toast } from "@/components/ui/use-toast";
import { shared_instructions, user_request, swarm1 } from "@/app/api/socket/swarm_io";
import { AuthUser } from "@supabase/supabase-js";
import { TooltipProvider } from "@/components/ui/tooltip";

export interface SwarmUIProps {
  user: any;
}
export function SwarmUI({ user }: SwarmUIProps) {
    const [sessions, setSessions] = useState<SwarmSession[]>();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [processState, setProcessState] = useState<string>('NOT CONNECTED');

    const handleProcessStateChange = (newState: ProcessState) => {
        setProcessState(newState);
        toast({
          title: 'Process State Changed',
          description: (
            <pre>{`Process state changed to ${newState}`}</pre>
          )
    
        });
      };

    const updateSwarmSessions = async (user_id: string, sessions: SwarmSession[]) => {
        await fetch(`/api/swarm/upsert-session`, {
          method: "put",
          body: JSON.stringify({ user_id: user_id, sessions: sessions }),
        });
      };

    const fetchSwarmSessions = async () => {
        if (!user) return;

        if (sessions && typeof sessions === 'object') {    
          setSessions(Object.values(sessions).map(
            (session: any) => ({ id: session.id, name: session.name, description: session.description } as SwarmSession)
          ));
        }
      };
    useEffect(() => {
        fetchSwarmSessions();
      }, [user]);
    
      // Function to handle adding a new session
      const handleAddSession = async () => {
        console.log('Adding new session');
        const tempSessionId = Math.random().toString(36);
        let updatedSessions;
        if (!sessions) {
          updatedSessions = [{ id: tempSessionId, name: `Session 1`, description: '' }];
        }
        else 
        {
          updatedSessions = sessions?.concat({ id: tempSessionId, name: `Session ${sessions.length + 1}`, description: '' });
        }
        
        if (updatedSessions) {
          await updateSwarmSessions(user?.id as string, updatedSessions);
          setSessionId(tempSessionId.toString());
          handleProcessStateChange('NEW_CONNECTION');
        }
      };
    
      const handleAddMessage = () => {
        socket?.send(JSON.stringify({ "action": "new_action", "sessionId": sessionId, "message": inputValue }));
        setInputValue('');
      };


    useEffect(() => {
        if (!sessionId) return;
        if (processState !== 'NOT CONNECTED') return;
        const socket = new WebSocket('ws://localhost:5000/ws/agency_swarm');
        socket.onopen = () => {
          handleProcessStateChange('CONNECTED');
          console.log('Socket connected');
          setSocket(socket);
        };
        socket.onclose = () => {
          handleProcessStateChange('COMPLETED');
          console.log('Socket closed');
        };
        socket.onmessage = (event) => {
          let result: { [x: string]: any; status: string; message: any; task_id: any; error: any; msg_type: string | number; };
    
          try {
            console.log('Event Data:', event.data);
            result = JSON.parse(event.data);
    
            if (result.status) {
              switch(result.status) {
                case 'error':
                  console.log('Error:', result.message);
                  break;
                case 'connected':
                  console.log('Connected:', result.status);
                  handleProcessStateChange('CONNECTED');
                  socket.send(JSON.stringify({ "action": "new_session", "sessionId": sessionId }));
                  break;
                case 'session_started':
                  console.log('Success:', result.status);
                  handleProcessStateChange('SESSION_STARTED');
                  socket.send(JSON.stringify({ "action": "init_agency", "sessionId": sessionId, "agency_chart": swarm1, "shared_instructions": shared_instructions }));
                  handleProcessStateChange('INITIALIZING');
                  break;
                case 'agency_initialized':
                  console.log('Success:', result.status);
                  handleProcessStateChange('INITIALIZED');
                  socket.send(JSON.stringify({ "action": "run_agency", "sessionId": sessionId, "message": user_request }));
                  handleProcessStateChange('RUNNING');
                  break;
                case 'task_completed':
                  console.log('Success:', result.status);
                  handleProcessStateChange('COMPLETED');
                  socket.close();
                  return;
                case 'new_task':
                  console.log('New task started:', result.task_id);
                  return;
                default:
                  console.log('Unknown status:', JSON.stringify(result));
                  break;
              }
    
              if(result.error) {
                console.log('Error:', result.error);
              }
    
            }
          } catch (error) {
            console.log('Error:', error);
          }
        }
      }, [sessionId, messages]);
    
      useEffect(() => {
        localStorage.setItem('sessions', JSON.stringify(sessions));
      }, [sessions]);
    
      useEffect(() => {
        localStorage.setItem('messages', JSON.stringify(messages));
      }, [messages]);
    
      useEffect(() => {
        localStorage.setItem('processState', processState);
      }, [processState]);

  return (
    <TooltipProvider>
    <div className="flex-grow overflow-auto">
          <div className="flex gap-4 w-full p-4 h-full">
            <div className="flex flex-col space-y-2">
              <Button onClick={() => handleAddSession()}>
                Create New Session <PlusIcon />
              </Button>
              {sessions?.map((session: SwarmSession) => {
                return (
                  <div key={session.id}>
                    <Button className="w-full" key={session.id} onClick={() => setSessionId(session.id)}>{session.name}</Button>
                  </div>
                )
              })}
            </div>
            <div className="flex flex-grow flex-col bg-white h-full justify-end">
              <div className="flex flex-col p-4 space-y-4 overflow-scroll">
              <SessionMessages socket={socket as WebSocket} messages={messages} setMessages={setMessages} />
              </div>
              <div className="flex bg-gray-100 rounded p-2">
                <Input id="message-input" type="text" className="flex-grow text-black" placeholder="Type a message..." onChange={(e) => setInputValue(e.target.value)} onKeyUp={(e) => e.key === 'Enter' && handleAddMessage()} />
                <Button id="send-message" type="submit" className="ml-2" onClick={() => handleAddMessage()}>
                  <ArrowBigRight className="w-6 h-6" />
                </Button>
              </div>

            </div>
          </div>
        </div>
        </TooltipProvider>
  )
}

