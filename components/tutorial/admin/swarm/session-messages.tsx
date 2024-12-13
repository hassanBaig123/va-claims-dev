'use client';
import { useEffect, useState } from "react";
import { Message, SwarmSession, MessageTypes } from "@/models/local/types";
import React, { createContext } from "react";

interface SessionMessagesProps {
    socket: WebSocket;
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export function SessionMessages({ socket, messages: initialMessages }: SessionMessagesProps) {
    const [storedMessageTypes, setStoredMessageTypes] = useState<MessageTypes>({});
    const [messages, setMessages] = useState<Message[]>(initialMessages);

    // Function to parse links and convert them into React elements
    const parseLinks = (text: string): JSX.Element[] => {
        // Ensure text is a string
        if (typeof text !== 'string') {
        console.error('parseLinks: text is not a string', text);
        return [];
        }
        
        // Define a regular expression to match the special tag wrapper [LINK][/LINK]
        // This regex does not make assumptions about the URL format
        const linkRegex = /\[LINK\](.*?)\[\/LINK\]/g;
        
        // Split the text by line breaks to maintain them
        const lines = text.split('\n');

        return lines.flatMap((line, lineIndex) => {
        // Split the line into parts by the linkRegex
        const parts = line.split(linkRegex).map((part, index) => {
            // If the part is a URL (every second match is a URL), create an anchor element
            if (index % 2 === 1) {
            return (
                <a key={`${lineIndex}-${index}`} href={part} target="_blank" rel="noopener noreferrer" className="text-link">
                Download
                </a>
            );
            } else {
            // If the part is not a URL, return a span element
            return <span key={`${lineIndex}-${index}`}>{part}</span>;
            }
        });
    
        // Add a <br /> after each line except the last one
        return lineIndex < lines.length - 1 ? [...parts, <br key={`br-${lineIndex}`} />] : parts;
        });
    };

    const handleMessage = (event: MessageEvent) => {
        try {
            console.log('Event Data:', event.data);
            const result = JSON.parse(event.data);

            if (result) {
                let newMessage: Message = { content: '', type: '' };
        
                setMessages(currentMessages => {
                // Check if the 'all' type is selected or if the specific type from msg_type is selected
                if (storedMessageTypes["all"] || storedMessageTypes[result.msg_type]) {
                    // Append the message based on the msg_type
                    switch (result.msg_type) {
                    case "text":
                        // For 'text' messages, check if 'my_text' is selected and if the message includes '@User'
                        if (storedMessageTypes["my_text"] && result.message.includes('@User') && result.message.includes('User 🗣️ @CEO')) {
                        newMessage = { content: result.message, type: 'my_text' };
                        } else if (storedMessageTypes["text"]) {
                        // If 'my_text' is not selected but 'text' is, add all 'text' messages
                        newMessage = { content: result.message, type: result.msg_type };
                        }
                        break;
                    case "function":
                        newMessage = { content: result.message, type: result.msg_type };
                        break;
                    case "function_output":
                        newMessage = { content: result.message, type: result.msg_type };
                        break;
                    }
                
                    // Return the new state by concatenating the new message
                    return [...currentMessages, newMessage];
                }
                
                // If the message type is not selected or no case matches, return the current state unchanged
                return currentMessages;
                });
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    };

    useEffect(() => {
    // Fetch selectedMessageTypes from localStorage or initialize it as an empty object
    setStoredMessageTypes(JSON.parse(localStorage.getItem("selectedMessageTypes") || "{}"));

    // Define a handler for storage changes
    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === "selectedMessageTypes") {
            setStoredMessageTypes(JSON.parse(event.newValue || "{}"));
        }
    };

    window.addEventListener('storage', handleStorageChange);

    if(socket) {
        socket.addEventListener('message', handleMessage);
    }

    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
    }, []);

  return (
    <>
    {messages?.map((message: Message, index: number) => (
        <div key={index} className={`bg-gray-100 p-2 rounded ${!storedMessageTypes[message.type] && "hidden"}`}>
            <p className="text-gray-600 w-fit text-with-whitespace">
            {parseLinks(message.content)}
            </p>
        </div>
    ))}
    </>
  );
}

