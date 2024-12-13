'use client';
import { PlusIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { SwarmSelector } from "@/components/admin/swarm/swarm-selector"
import { presets } from "@/components/admin/swarm/data/presets"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { ArrowBigRight } from "lucide-react"
import { Fragment, useEffect, useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { DisplayMessageType } from "@/components/admin/swarm/display-message-type";
import { toast } from "@/components/ui/use-toast";
import { Swarm, Swarms, shared_instructions, user_request } from "@/app/api/socket/swarm_io";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider"
import { useSwarmSessions } from "@/lib/hooks/use-swarm-sessions"
import { useSwarm } from "@/lib/providers/swarm-provider";
import { useRouter } from "next/router";
import { parseLinks } from "@/utils/render-helpers/parse-links";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { SwarmSession, Message, ProcessState, PlaceholderFormat } from "@/models/local/types";

export default function PlaygroundPage() {
  const { user } = useSupabaseUser();
  const { subscribeToSession, unsubscribeFromSession, setUpdateHandler, sendMessage, sendError, sendTask, sendCallback } = useSwarm();
  const [refetchTrigger, setRefetchTrigger] = useState<number>(0);
  const { sessions } = useSwarmSessions(user?.id as string, refetchTrigger);
  const [messages, setMessages] = useState<Message[]>([]);
  const [processState, setProcessState] = useState<ProcessState>('NOT_CONNECTED');
  const [inputValue, setInputValue] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [socket, setSocket] = useState<WebSocket>();
  const [selectedMessageTypes, setSelectedMessageTypes] = useState<{ [key: string]: boolean }>({});
  const [selectedSwarm, setSelectedSwarm] = useState<string | null>(null);
  
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogInputs, setDialogInputs] = useState<{ [key: string]: string }>({});
  const [placeholders, setPlaceholders] = useState<PlaceholderFormat[]>([]);
  

  const closeOpenSessions = () => {
    sessions?.forEach(session => {
      if (session.socket) {
        session.socket.close();
      }
    });
  };

  const prepareAndOpenDialog = (sessionId: string) => {
    const currSession = sessions?.find(s => s.id === sessionId);
    const swarm = Swarms.find((swarm) => swarm.id === currSession?.swarmId);
    if (!swarm) return;

    const fieldsToPrompt = { user_request: swarm.user_request, shared_instructions: swarm.shared_instructions };
    let foundPlaceholders: { [key: string]: PlaceholderFormat } = {};
  
    Object.entries(fieldsToPrompt).forEach(([key, value]) => {
      const regex = /{{(.*?):label=(.*?),placeholder=(.*?),type=(.*?)}}/g;
      let match;
      while ((match = regex.exec(value)) !== null) {
        const [fullMatch, placeholderKey, label, placeholder, type] = match;
        if (!foundPlaceholders[placeholderKey]) {
          foundPlaceholders[placeholderKey] = {
            label: label,
            placeholder: placeholder,
            type: type as 'text' | 'number' | 'date' | 'large_text'
          };
        }
      }
    });
  
    // Convert the foundPlaceholders object into an array of PlaceholderFormat
    const placeholdersArray = Object.values(foundPlaceholders);
  
    // Check if placeholdersArray has any items
    if (placeholdersArray.length > 0) {
      setPlaceholders(placeholdersArray);
      setDialogInputs(placeholdersArray.reduce((acc, { label, placeholder }) => {
        acc[label] = placeholder;
        return acc;
      }, {} as { [key: string]: string }));
      setIsDialogOpen(true);
    } else {
      handleProcessStateChange('NEW_CONNECTION');
      setSessionId(sessionId);
    }
  };

const handleDialogSubmit = () => {
  const currSession = sessions?.find(s => s.id === sessionId);
  if (!currSession) return;
  const currSwarm = Swarms.find((swarm) => swarm.id === currSession.swarmId);
  if (!currSwarm) return;

  // Here you would replace placeholders in user_request and shared_instructions
  // with the values from dialogInputs, then proceed with the rest of handleStartSession logic
  setIsDialogOpen(false);
  // Example of replacing placeholders in user_request
  let modifiedUserRequest = currSwarm.user_request;
  if (modifiedUserRequest) {
    Object.entries(dialogInputs).forEach(([placeholder, value]) => {
        modifiedUserRequest = modifiedUserRequest?.replace(`{${placeholder}}`, String(value));
    });
  }
  let modifiedSharedInstructions = currSwarm.shared_instructions;
  if (modifiedSharedInstructions) {
    Object.entries(dialogInputs).forEach(([placeholder, value]) => {
        modifiedSharedInstructions = modifiedSharedInstructions?.replace(`{${placeholder}}`, String(value));
    });
  }

  currSwarm.user_request = modifiedUserRequest || currSwarm.user_request;
  currSwarm.shared_instructions = modifiedSharedInstructions || currSwarm.shared_instructions;
  
  setSelectedSwarm(currSwarm.id);
  handleProcessStateChange('NEW_CONNECTION');
  setSessionId(sessionId);
};

  // Define a function to update the selected swarm
  const handleSwarmSelection = async (swarm: Swarm) => {
    console.log('Swarm selected:', swarm);
    setSelectedSwarm(swarm.id);
  };

  const handleStartSession = async (sessionId: string, swarmId: string) => {
    console.log('Starting session:', sessionId);
    console.log('Selected Swarm:', swarmId);
    const selectedSession = sessions?.find((s: any) => s.id === sessionId);
    const newSocket = new WebSocket('ws://localhost:5000/ws/agency_swarm');
    if (selectedSession) {
      selectedSession.socket = newSocket;
      selectedSession.swarmId = swarmId;
    }
    const swarm = Swarms.find((swarm) => swarm.id === swarmId);
    if (swarm) {
      setSelectedSwarm(swarm.id);
      prepareAndOpenDialog(sessionId);
    }
  };

  // Function to handle adding a new session
  const handleAddSession = async () => {
    console.log('Adding new session');
    const tempSessionId = Math.random().toString(36);
    let updatedSessions;
    if (!sessions) {
      updatedSessions = [{ id: tempSessionId, name: `Session 1`, description: '', swarmId: selectedSwarm } as SwarmSession];
    } else {
      updatedSessions = sessions?.concat({ id: tempSessionId, name: `Session ${sessions.length + 1}`, description: '', swarmId: selectedSwarm } as SwarmSession);
      console.log('Updated Sessions:', updatedSessions);
    }
    
    if (updatedSessions) {
      console.log('Updated Sessions:', updatedSessions);
      await updateSwarmSessions(user?.id as string, updatedSessions);
      handleStartSession(tempSessionId, selectedSwarm as string);
    }
  };
  
  const handleAddMessage = (sessionId: string) => {
    const session = sessions?.find(s => s.id === sessionId);
    if (session && session.socket) {
      session.socket.send(JSON.stringify({ "action": "new_action", "sessionId": sessionId, "message": inputValue }));
      setInputValue('');
    }
  };

  const handleProcessStateChange = (newState: ProcessState) => {
    setProcessState(newState);
    toast({
      title: 'Process State Changed',
      description: (
        <pre>{`Process state changed to ${newState}`}</pre>
      )
    });
  };

  useEffect(() => {
    if (!user) return;
    fetchSwarmSessions();
  }, [user]);

  const handleSocketStatusMessage = (session: SwarmSession, eventData: any) => {
    const currSession = session.swarmId;
    const currSwarm = Swarms.find((swarm) => swarm.id === currSession);
    if (!currSwarm) return;

    if (eventData.status) {
      switch(eventData.status) {
        case 'connected':
          console.log('Connected:', eventData.status);
          handleProcessStateChange('CONNECTED');
          session.socket?.send(JSON.stringify({ "action": "new_session", "sessionId": sessionId }));
          break;
        case 'session_started':
          console.log('Success:', eventData.status);
          handleProcessStateChange('SESSION_STARTED');
          session.socket?.send(JSON.stringify({
            "action": "init_agency",
            "sessionId": sessionId,
            "agency_chart": currSwarm?.agency_chart,
            "shared_instructions": currSwarm?.shared_instructions
          }));
          handleProcessStateChange('INITIALIZING');
          break;
        case 'agency_initialized':
          console.log('Success:', eventData.status);
          handleProcessStateChange('INITIALIZED');
          session.socket?.send(JSON.stringify({
            "action": "run_agency",
            "sessionId": sessionId,
            "message": currSwarm?.user_request
          }));
          handleProcessStateChange('RUNNING');
          break;
        case 'task_completed':
          console.log('Success:', eventData.status);
          handleProcessStateChange('COMPLETED');
          session.socket?.close();
          break;
        case 'new_task':
          console.log('New task started:', eventData.task_id);
          break;
      }
    }
  };

  const handleSocketSwarmMessage = (session: SwarmSession, eventData: any) => {
    const { msg_type, message } = eventData;
    if(!msg_type) return;
    switch(msg_type) {
      case 'text':
      let newMessage: Message = { content: '', type: '' };  
      if (selectedMessageTypes["my_text"] && eventData.message.includes('@User') && eventData.message.includes('User 🗣️ @CEO')) {
          newMessage = { content: message, type: 'my_text' };
        } else if (selectedMessageTypes["text"]) {
          // If 'my_text' is not selected but 'text' is, add all 'text' messages
          newMessage = { content: message, type: msg_type };
        }
        setMessages(currentMessages => [...currentMessages, newMessage]);
        break;
      case 'function':
        if (selectedMessageTypes["all"] || selectedMessageTypes["function"]) {
          setMessages(currentMessages => [...currentMessages, { content: message, type: msg_type }]);
        }
        break;
      case 'function_output':
        if (selectedMessageTypes["all"] || selectedMessageTypes["function_output"]) {
          setMessages(currentMessages => [...currentMessages, { content: message, type: msg_type }]);
        }
        break;
      default:
        console.error('Unknown message type:', msg_type);
        break;
    }
  }

  const handleWebSocketMessage = (session: SwarmSession, eventData: any) => {
    try {
      if (eventData.status) {
        handleSocketStatusMessage(session, eventData);
      } else if(eventData.error) {
        handleSocketErrorMessage(session, eventData);
      } else if(eventData.msg_type) {
        handleSocketSwarmMessage(session, eventData);
      } else {
        handleSocketUnknownMessage(session, eventData);
      }
    } catch (error) {
      console.error('Error in handleWebSocketMessage:', error);
    }
  };

  const initializeWebSocketListeners = (session: SwarmSession) => {
    if (session.socket) {
      session.socket.onopen = () => {
        handleProcessStateChange('CONNECTED');
        console.log('Socket connected');
        setSocket(socket);
      };
      session.socket.onclose = () => {
        handleProcessStateChange('COMPLETED');
        console.log('Socket closed');
      };
      session.socket.onmessage = (event) => {
        console.log('Event Data:', event.data);
        try {
          const eventData = JSON.parse(event.data);
          //Is Status Message
          if (eventData.status) {
            handleSocketStatusMessage(session, eventData);
          }
          if(eventData.error) {
            handleSocketErrorMessage(session, eventData);
            console.error('Error:', eventData.error);
          }
        } catch (error) {
          if(event.data) {
            console.log('Error:', event.data);
          }
        }
      }  
    }
  }

  useEffect(() => {
    console.log('SessionId:', sessionId);
    if (!sessionId) return;
    const currentSession = sessions?.find(s => s.id === sessionId);
    if (!currentSession) return;
    const processState = currentSession.processState;
    if (processState !== 'NOT CONNECTED' && processState !== 'NEW_CONNECTION') return;
    if (socket?.readyState !== WebSocket.CONNECTING) return;
    
    initializeWebSocketListeners(currentSession as SwarmSession);

  }, [sessionId]);

  // Save objects to local storage
  useEffect(() => {
    localStorage.setItem('sessions', JSON.stringify(sessions));
  }, [sessions?.length]);

  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [messages.length]);

  useEffect(() => {
    const storedMessageTypes = JSON.parse(localStorage.getItem("selectedMessageTypes") || "{}");
    setSelectedMessageTypes(storedMessageTypes);

    const handleStorageChange = () => {
      setSelectedMessageTypes(JSON.parse(localStorage.getItem("selectedMessageTypes") || "{}"));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const fetchSwarmSessions = async () => {
    if (!sessions) return;
      for (const session of sessions) {
        if (session && session.id && session.swarmId) {
          subscribeToSession(session.id, session.swarmId);
        }
      }
    };

  const updateSwarmSessions = async (user_id: string, sessions: SwarmSession[]) => {

    console.log('Updating user_id:', user_id);
    console.log('Updating swarm sessions:', sessions);
    console.log('Updating swarm sessions json string:', JSON.stringify({ userId: user_id, sessions: sessions }));
    const response = await fetch(`/api/swarm/upsert-session`, {
      method: "put",
      body: JSON.stringify({ userId: user_id, sessions: sessions }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to update swarm sessions');
    }

    const data = await response.json();
    console.log('Response:', data);
    return data;
  };

  const handleSocketErrorMessage = (session: SwarmSession, eventData: any) => {
    console.error('Error:', eventData.error);
  };

  const handleSocketUnknownMessage = (session: SwarmSession, eventData: any) => {
    try {
      console.error('Unknown status:', JSON.stringify(eventData));
    } catch (error) {
      console.error('Could not stringify socket message:', error);
      console.error('Event Data:', eventData);
    }
  };

  return (
    <TooltipProvider>
      {isDialogOpen && (
        <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(false)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Fill in the details</DialogTitle>
            <DialogDescription>Provide values for the placeholders.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
          {placeholders.map((placeholder) => (
            <div key={placeholder.label} className="grid grid-cols-1 items-center gap-4">
                <Label htmlFor={placeholder.label} className="text-left">
                  {placeholder.label}
            </Label>
            {placeholder.type === 'large_text' ? (
              <textarea
                id={placeholder.label}
                placeholder={placeholder.placeholder} // Temporary placeholder text
                rows={5}
                onFocus={(e) => {
                  // Clear the temporary placeholder when the input is focused
                  if (e.target.value === '') {
                    e.target.placeholder = '';
                  }
                }}
                onBlur={(e) => {
                  // Restore the temporary placeholder when the input loses focus and is empty
                  if (e.target.value === '') {
                    e.target.placeholder = placeholder.placeholder;
                  }
                }}
                onChange={(e) => {
                  const target = e.target;
                  setDialogInputs({ ...dialogInputs, [placeholder.label]: e.target.value });
                  target.style.height = 'auto';
                  target.style.height = `${target.scrollHeight}px`;
                }}
                className="textarea-class w-full"
              />
            ) : (
              <Input
                id={placeholder.label}
                type={placeholder.type}
                placeholder={placeholder.placeholder} // Temporary placeholder text
                onFocus={(e) => {
                  // Clear the temporary placeholder when the input is focused
                  if (e.target.value === '') {
                    e.target.placeholder = '';
                  }
                }}
                onBlur={(e) => {
                  // Restore the temporary placeholder when the input loses focus and is empty
                  if (e.target.value === '') {
                    e.target.placeholder = placeholder.placeholder;
                  }
                }}
                onChange={(e) => setDialogInputs({ ...dialogInputs, [placeholder.label]: e.target.value })}
              />
            )}
          </div>
          ))}
          </div>
          <DialogFooter>
            <Button onClick={handleDialogSubmit} autoFocus={true}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      )}
      <div className="flex flex-col h-[90vh]">
        <div className="flex w-full p-4 justify-between">
          <h2 className="text-lg font-semibold">Swarm Playground</h2>
          
        </div>
        <div className="flex p-4 space-x-2 justify-between">
        <SwarmSelector swarms={Swarms} onSwarmSelected={handleSwarmSelection} />
        <HoverCard>
              <HoverCardTrigger asChild>
                <Button>Display Options</Button>
              </HoverCardTrigger>
              <HoverCardContent side="top" sideOffset={8}>
                <div className="p-4 bg-white rounded-md">
                <DisplayMessageType onCheckedChange={function (checked: boolean): void {
                  throw new Error("Function not implemented.");
                } } />
                </div>
              </HoverCardContent>
              </HoverCard>
        </div>
        <div className="flex-grow overflow-auto">
          <div className="flex gap-4 w-full p-4 h-full">
            <div className="flex flex-col space-y-2">
              <Button key="create-new-session" onClick={() => handleAddSession()}>
                Create New Session <PlusIcon />
              </Button>
              {sessions?.map((session: SwarmSession) => {
                console.log('Session added to buttons:', session);
                return (
                  <div key={session.id}>
                    <Button 
                    className="w-full" 
                    key={session.id} 
                    onClick={() => handleStartSession(session.id, session.swarmId as string)}>{session.name}</Button>
                  </div>
                )
              })}
            </div>
            <div className="flex flex-grow flex-col bg-white h-full justify-end">
              <div key={JSON.stringify(selectedMessageTypes)} className="flex flex-col p-4 space-y-4 overflow-scroll">
              {messages?.map((message, index) => (
                <div key={index} className={`bg-gray-100 p-2 rounded ${!selectedMessageTypes[message.type] && "hidden"}`}>
                  <p className="text-gray-600 w-fit text-with-whitespace">
                    {parseLinks(message.content)}
                  </p>
                </div>
              ))}
              </div>
              <div className="flex bg-gray-100 rounded p-2">
                <Input id="message-input" type="text" className="flex-grow text-black" placeholder="Type a message..." onChange={(e) => setInputValue(e.target.value)} onKeyUp={(e) => e.key === 'Enter' && handleAddMessage(sessionId as string)} />
                <Button id="send-message" type="submit" className="ml-2" onClick={() => handleAddMessage(sessionId as string)}>
                  <ArrowBigRight className="w-6 h-6" />
                </Button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
};
