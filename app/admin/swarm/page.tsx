'use client';

import { PlusIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { SwarmSelector } from "@/components/admin/swarm/swarm-selector"
import { Swarms } from "@/app/api/socket/swarm_io"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Fragment, useEffect, useRef, useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { DisplayMessageType } from "@/components/admin/swarm/display-message-type";
import { toast } from "@/components/ui/use-toast";
import { Swarm, shared_instructions, user_request } from "@/app/api/socket/swarm_io";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider"
import { useSwarmSessions } from "@/lib/hooks/use-swarm-sessions"
import { useSwarm, Update, StatusUpdate, MessageUpdate, ErrorUpdate, SwarmProvider } from "@/lib/providers/swarm-provider";
import { parseLinks } from "@/utils/render-helpers/parse-links";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { SwarmSession, Message, ProcessState, PlaceholderFormat } from "@/models/local/types";
import { useMutation, useQueryClient } from 'react-query';
import { ArrowRightIcon } from "@radix-ui/react-icons";

export default function PlaygroundPage() {
  return (
    <SwarmProvider>
      <PlaygroundPageContent />
    </SwarmProvider>
  );
}

function PlaygroundPageContent() {
  const { user } = useSupabaseUser();
  const [reFetchTrigger, setReFetchTrigger] = useState(0);
  const { sessions: userSessions } = useSwarmSessions(user?.id as string, reFetchTrigger);

  const [messages, setMessages] = useState<Message[]>([]);
  const [processState, setProcessState] = useState<ProcessState>('DISCONNECTED');

  const [inputValue, setInputValue] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { subscribeToSession, unsubscribeFromSession, sendMessage, sendCallback, sendError, sendTask, setUpdateHandler } = useSwarm();
  const [selectedMessageTypes, setSelectedMessageTypes] = useState<{ [key: string]: boolean }>({});
  const [selectedSwarm, setSelectedSwarm] = useState<Swarm>();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogInputs, setDialogInputs] = useState<{ [key: string]: string }>({});
  const [placeholders, setPlaceholders] = useState<PlaceholderFormat[]>([]);

  const queryClient = useQueryClient();

  const handleSocketStatusMessage = async (sessionId: string, eventData: StatusUpdate) => {
    console.log('Status message:', eventData);
    if (eventData.status) {
      console.log('Status:', eventData.status);
      switch(eventData.status) {
        case 'CONNECTED':
          console.log('Success:', eventData.status);
          handleProcessStateChange(sessionId, 'CONNECTED');

          if(selectedSwarmRef.current) {
            const result = await runAgencyMutation.mutateAsync({ sessionId, message: selectedSwarmRef.current?.user_request as string});
            console.log('Run Agency Result:', result);
          }
          else 
          {
            console.error('Selected Swarm is not set. Current value:', selectedSwarmRef.current);
          }
          break;
        case 'AUTHENTICATED':
          console.log('Success:', eventData.status);
          handleProcessStateChange(sessionId, 'AUTHENTICATED');
          break;
        case 'SUBSCRIBED':
          console.log('Success:', eventData.status);
          handleProcessStateChange(sessionId, 'SUBSCRIBED');
          break;
        default:
          console.error('Unknown status:', eventData.status);
          break;
      }
    }
  };

  const handleSocketSwarmMessage = (sessionId: string, eventData: any) => {
    const { msg_type, message } = eventData;
    if(!msg_type) return;
    switch(msg_type) {
      case 'text':
        let newMessage: Message = { content: message, type: msg_type };
        if (eventData.message.includes('@User') || eventData.message.includes('User 🗣️')) {
          console.log('my_text message:', message);
          newMessage = { content: message, type: 'my_text' };
        } else {
          console.log('text message:', message);
          newMessage = { content: message, type: msg_type };
        }
        console.log('Adding message:', newMessage);
        console.log('Current messages:', messages);
        setMessages(currentMessages => [...currentMessages, newMessage]);
        break;
      case 'function':
        console.log('Function message:', message);
        if (selectedMessageTypes["all"] || selectedMessageTypes["function"]) {
          setMessages(currentMessages => [...currentMessages, { content: message, type: msg_type }]);
        }
        break;
      case 'function_output':
        console.log('Function output:', message);
        if (selectedMessageTypes["all"] || selectedMessageTypes["function_output"]) {
          setMessages(currentMessages => [...currentMessages, { content: message, type: msg_type }]);
        }
        break;
      default:
        console.error('Unknown message type:', msg_type);
        break;
    }
  }

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

  useEffect(() => {
    const immediateUpdateHandler = async (update: Update) => {
      console.log('Immediate update:', update);
        switch (update.type) {
          case 'status':
            console.log('Status update:', update);
            await handleSocketStatusMessage(update.sessionId, update);
            break;
          case 'message':
            console.log('Message type update:', update);
            handleSocketSwarmMessage(update.sessionId, update);
            break;
          case 'error':
            console.log('Error update:', update);
            handleSocketErrorMessage(update.sessionId, update.error);
            break;
          default:
            console.log('Unknown update type:', update);
            handleSocketUnknownMessage(update.sessionId, update);
            break;
        }
    };
    console.log('Setting update handler:', immediateUpdateHandler);
    setUpdateHandler(immediateUpdateHandler);
    console.log('Update handler set:', immediateUpdateHandler);

    return () => {
      console.log('Unsetting update handler:', immediateUpdateHandler);
      setUpdateHandler(() => {});
      console.log('Update handler unset:', immediateUpdateHandler);
    }
  }, [handleSocketStatusMessage, handleSocketSwarmMessage, setUpdateHandler]);
  
  const initAgencyMutation = useMutation(
    (sessionData: { sessionId: string; agency_chart: any[]; shared_instructions: string }) =>
      fetch('http://localhost:5000/init_agency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
      }).then((res) => res.json()),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('sessions');
      },
    }
  );

  const selectedSwarmRef = useRef<Swarm | null>(selectedSwarm || null);

  useEffect(() => {
    selectedSwarmRef.current = selectedSwarm as Swarm;
  }, [selectedSwarm]);

  const runAgencyMutation = useMutation(
    (runData: { sessionId: string; message: string }) =>
      fetch('http://localhost:5000/run_agency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(runData),
      }).then((res) => res.json()),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('sessions');
      },
    }
  );

  const prepareAndOpenDialog = (sessionId: string) => {
    if (!selectedSwarm) return;

    const fieldsToPrompt = { user_request: selectedSwarm.user_request, shared_instructions: selectedSwarm.shared_instructions };
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
  
    const placeholdersArray = Object.values(foundPlaceholders);
  
    if (placeholdersArray.length > 0) {
      setPlaceholders(placeholdersArray);
      setDialogInputs(placeholdersArray.reduce((acc, { label, placeholder }) => {
        acc[label] = placeholder;
        return acc;
      }, {} as { [key: string]: string }));
      setIsDialogOpen(true);
    } else {
      initializeSession(sessionId);
    }
  };

  const handleDialogSubmit = () => {
    const tempSwarm = selectedSwarm;
    if (!tempSwarm) return;
  
    const replacePlaceholders = (text: string) => {
      const regex = /{{(.*?):label=(.*?),placeholder=(.*?),type=(.*?)}}/g;
      return text.replace(regex, (match: string, identifier: string, label: string) => {
        return dialogInputs[label] || '';
      });
    };
  
    const modifiedUserRequest = replacePlaceholders(tempSwarm.user_request);
    const modifiedSharedInstructions = replacePlaceholders(tempSwarm.shared_instructions);

    console.log('Modified User Request:', modifiedUserRequest);
    console.log('Modified Shared Instructions:', modifiedSharedInstructions);
  
    const newSwarm = {
      ...tempSwarm,
      user_request: modifiedUserRequest,
      shared_instructions: modifiedSharedInstructions
    };
    selectedSwarmRef.current = newSwarm;
    initializeSession(sessionId as string);
    setIsDialogOpen(false);
  };

  const handleSwarmSelection = async (swarm: Swarm) => {
    console.log('Swarm selected:', swarm);
    setSelectedSwarm(swarm);
  };

  const handleStartSession = async (sessionId: string, swarmId: string) => {
    const swarm = Swarms.find((swarm) => swarm.id === swarmId);
    if (swarm) {
      setSelectedSwarm(swarm);
      setSessionId(sessionId);
      prepareAndOpenDialog(sessionId);
    }
  };

  const initializeSession = async (sessionId: string) => {
    try {
      console.log('Initializing session with updated swarm:', selectedSwarmRef.current);
      const result = await initAgencyMutation.mutateAsync({
        sessionId: sessionId,
        agency_chart: selectedSwarmRef.current?.agency_chart || [],
        shared_instructions: selectedSwarmRef.current?.shared_instructions as string,
      });
      console.log('Init Agency Result:', result);
    } catch (error) {
      console.error('Error initializing agency:', error);
    }
  };

  const handleAddSession = async () => {
    if(!user) return;
    console.log('Adding new session');
    const tempSessionId = Math.random().toString(36);
    let updatedSessions;
    if (!userSessions) {
      updatedSessions = [{ id: tempSessionId, name: `Session 1`, description: '', swarmId: selectedSwarm?.id as string } as SwarmSession];
    } else {
      updatedSessions = userSessions?.concat({ id: tempSessionId, name: `Session ${userSessions.length + 1}`, description: '', swarmId: selectedSwarm?.id as string } as SwarmSession);
    }
    
    if (updatedSessions) {
      await updateSwarmSessions(user?.id as string, updatedSessions);
      setReFetchTrigger(prev => prev + 1);
      subscribeToSession(user.id as string, tempSessionId);
      handleStartSession(tempSessionId, selectedSwarm?.id as string);
      setSessionId(tempSessionId.toString());
    }
  };

  const handleAddMessage = (sessionId: string) => {
    if (inputValue.trim() !== '') {
      sendMessageMutation.mutate({
        sessionId,
        message: inputValue
      }, {
        onSuccess: () => {
          setInputValue('');
        },
        onError: (error) => {
          console.error('Error sending message:', error);
        }
      });
    }
  };

  const handleProcessStateChange = (sessionId: string, newState: ProcessState, message?: any) => {
    setProcessState(newState);
    toast({
      title: 'Process State Changed',
      description: (
        <>
        <pre>{`Process state changed to ${newState} for session ${sessionId}`}</pre>
        {message && <pre>{`Message: ${message}`}</pre>}
        </>
      )
    });
  };

  useEffect(() => {
    if (!user || !userSessions) return;
    console.log('Sessions updated. Subscribing to sessions.');
    for (const session of userSessions) {
      console.log('Subscribing ', user.id, 'to session:', session.id);
      subscribeToSession(user.id, session.id);
    }

    return () => {
      if (userSessions) {
        console.log('Unsubscribing from sessions.');
        for (const session of userSessions) {
          console.log('Unsubscribing ', user.id, 'from session:', session.id);
          unsubscribeFromSession(user.id, session.id);
        }
      }
    };
  }, [user, userSessions, subscribeToSession, unsubscribeFromSession]);

  const sendMessageMutation = useMutation(
    (messageData: { sessionId: string; message: string }) =>
      fetch('http://localhost:5000/send_message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      }).then((res) => res.json()),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['messages', sessionId]);
      },
    }
  );

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

  useEffect(() => {
    const storedItems = getUpdatedMessageDisplayFromStorage();
    setSelectedMessageTypes(storedItems);
  }, []);

  const getUpdatedMessageDisplayFromStorage = () => {
    const storedData = localStorage.getItem('selectedMessageTypes');
    if (storedData) {
      const storedItems = JSON.parse(storedData);
      setSelectedMessageTypes(storedItems);
      return storedItems;
    }
    return {};
  };

  return (
    <TooltipProvider>
      {isDialogOpen && (
        <div>
          <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(false)}>
            <DialogContent className="flex flex-col items-start">
              <DialogHeader>
                <DialogTitle>Fill in the details</DialogTitle>
                <DialogDescription>Provide values for the placeholders.</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col w-full gap-y-10">
                {placeholders.map((placeholder) => (
                  <div key={placeholder.label} className="gap-y-10">
                    <Label htmlFor={placeholder.label} className="text-left">
                      {placeholder.label}
                    </Label>
                    {placeholder.type === 'large_text' ? (
                      <textarea
                        id={placeholder.label}
                        placeholder={placeholder.placeholder}
                        rows={5}
                        onFocus={(e) => {
                          if (e.target.value === '') {
                            e.target.placeholder = '';
                          } else {
                            e.target.style.height = `${e.target.scrollHeight}px`;
                          }
                        }}
                        onBlur={(e) => {
                          if (e.target.value === '') {
                            e.target.placeholder = placeholder.placeholder;
                          } else {
                            e.target.style.height = 'auto';
                          }
                        }}
                        onChange={(e) => {
                          setDialogInputs({ ...dialogInputs, [placeholder.label]: e.target.value});
                          e.target.style.height = `${e.target.scrollHeight}px`;
                        }}
                        className="textarea-class w-full"
                      />
                    ) : (
                      <Input
                        id={placeholder.label}
                        type={placeholder.type}
                        placeholder={placeholder.placeholder}
                        onFocus={(e) => {
                          if (e.target.value === '') {
                            e.target.placeholder = '';
                          }
                        }}
                        onBlur={(e) => {
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
        </div>
      )}
      <div className="flex flex-col h-[90vh]">
        <div className="flex w-full p-4 justify-between">
          <h2 className="text-lg font-semibold">Swarm Playground</h2>
        </div>
        <div className="flex p-4 space-x-2 justify-between">
          <SwarmSelector swarms={Swarms} onSwarmSelected={handleSwarmSelection} selectedSwarmId={selectedSwarm?.id} />
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button>Display Options</Button>
            </HoverCardTrigger>
            <HoverCardContent side="top" sideOffset={8}>
              <div className="p-4 bg-white rounded-md">
                <DisplayMessageType onCheckedChange={getUpdatedMessageDisplayFromStorage} />
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
              {userSessions?.map((session: SwarmSession) => {
                console.log('Session added to buttons:', session);
                return (
                  <div key={session.id}>
                    <Button 
                      className="w-full" 
                      key={session.id} 
                      onClick={() => handleStartSession(session.id, session.swarmId as string)}
                    >
                      {session.name}
                    </Button>
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
                <Input 
                  id="message-input" 
                  type="text" 
                  className="flex-grow text-black" 
                  placeholder="Type a message..." 
                  onChange={(e) => setInputValue(e.target.value)} 
                  onKeyUp={(e) => e.key === 'Enter' && handleAddMessage(sessionId as string)} 
                />
                <Button 
                  id="send-message" 
                  type="submit" 
                  className="ml-2" 
                  onClick={() => handleAddMessage(sessionId as string)}
                >
                  <ArrowRightIcon className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}