'use client';
import { Update, useSwarm } from "@/lib/providers/swarm-provider";
import { useEffect } from "react";

export default function TestEventPage() {
    const { subscribeToSession, unsubscribeFromSession, sendMessage, sendCallback, sendError, sendTask, setUpdateHandler } = useSwarm();

    useEffect(() => {
        // Define a function to handle updates immediately
        const immediateUpdateHandler = async (update: Update) => {
          console.log('Immediate update:', update);
            switch (update.type) {
                case 'callback':
                    console.log('Callback update:', update);
                    handleSocketCallback(update.sessionId, update.callback);
                    break;
              case 'message':
                console.log('Message type update:', update);
                handleSocketMessage(update.sessionId, update);
                break;
              case 'error':
                console.log('Error update:', update);
                handleSocketMessage(update.sessionId, update.error);
                break;
            }
        };
        // Set the update handler to the immediateUpdateHandler
        console.log('Setting update handler:', immediateUpdateHandler);
        setUpdateHandler(immediateUpdateHandler);
        console.log('Update handler set:', immediateUpdateHandler);
    
      return () => 
      {
        console.log('Unsetting update handler:', immediateUpdateHandler);
        setUpdateHandler(() => {});
        console.log('Update handler unset:', immediateUpdateHandler);
      }
    }, []);

    const sendTestMessage = () => {
        console.log('Sending test message');
        sendMessage('123', '456', 'Hello, World!', 'test');
    }

    return(
        <div>
            <h1>Test Event Page</h1>
            <button onClick={sendTestMessage}>Send Test Message</button>
        </div>
    
    )
}

function handleSocketCallback(sessionId: any, callback: any) {
    throw new Error("Function not implemented.");
}
function handleSocketMessage(sessionId: any, update: Update) {
    throw new Error("Function not implemented.");
}

