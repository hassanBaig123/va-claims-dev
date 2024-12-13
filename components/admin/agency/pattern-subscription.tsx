'use client';

import React, { useState, useEffect, useCallback } from 'react';

export default function PatternSubscribe() {
    const [patterns, setPatterns] = useState<string[]>([]);
    const [currentPattern, setCurrentPattern] = useState('');
    const [messages, setMessages] = useState<string[]>([]);
    const [eventSource, setEventSource] = useState<EventSource | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    // Load patterns from local storage on component mount
    useEffect(() => {
        const storedPatterns = localStorage.getItem('subscribedPatterns');
        if (storedPatterns) {
            setPatterns(JSON.parse(storedPatterns));
        }
    }, []);

    // Save patterns to local storage whenever they change
    useEffect(() => {
        localStorage.setItem('subscribedPatterns', JSON.stringify(patterns));
    }, [patterns]);

    const subscribeToPattern = useCallback(() => {
        if (currentPattern && !patterns.includes(currentPattern)) {
            setPatterns(prevPatterns => [...prevPatterns, currentPattern]);
        }

        if (eventSource) {
            eventSource.close();
        }

        const newPatterns = [...patterns, currentPattern].filter(Boolean);
        console.log(`Subscribing to patterns: ${newPatterns.join(', ')}`);
        const newEventSource = new EventSource(`/api/sse-pattern?pattern=${encodeURIComponent(newPatterns.join(','))}`);
        
        newEventSource.onopen = () => {
            console.log('EventSource connection opened');
            setIsConnected(true);
        };

        newEventSource.onmessage = (event) => {
            console.log('Received message:', event.data);
            const data = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, JSON.stringify(data, null, 2)]);
        };

        newEventSource.addEventListener('connected', (event) => {
            console.log('Connected event received:', event);
            const data = JSON.parse((event as MessageEvent).data);
            setMessages((prevMessages) => [...prevMessages, `Connected: ${data.message}`]);
        });

        newEventSource.addEventListener('keep-alive', (event) => {
            console.log('Keep-alive event received:', event);
        });

        newEventSource.onerror = (error) => {
            console.error('EventSource failed:', error);
            setIsConnected(false);
            newEventSource.close();
        };

        setEventSource(newEventSource);
        setCurrentPattern('');
    }, [currentPattern, patterns, eventSource]);

    const disconnect = useCallback(() => {
        if (eventSource) {
            console.log('Closing EventSource connection');
            eventSource.close();
            setEventSource(null);
            setIsConnected(false);
        }
    }, [eventSource]);

    // Auto-subscribe to stored patterns on component mount
    useEffect(() => {
        if (patterns.length > 0 && !eventSource) {
            subscribeToPattern();
        }
    }, [patterns, eventSource, subscribeToPattern]);

    useEffect(() => {
        return () => {
            if (eventSource) {
                console.log('Closing EventSource connection');
                eventSource.close();
            }
        };
    }, [eventSource]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Pattern Subscribe</h1>
            <div className="mb-4">
                <input
                    type="text"
                    value={currentPattern}
                    onChange={(e) => setCurrentPattern(e.target.value)}
                    placeholder="Enter pattern (e.g., user:*)"
                    className="border p-2 mr-2"
                />
                <button
                    onClick={subscribeToPattern}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                    Subscribe
                </button>
                <button
                    onClick={disconnect}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    disabled={!isConnected}
                >
                    Disconnect
                </button>
            </div>
            <div className="mb-2">
                Connection status: {isConnected ? 'Connected' : 'Disconnected'}
            </div>
            <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Subscribed Patterns:</h2>
                <ul className="list-disc pl-5">
                    {patterns.map((p, index) => (
                        <li key={index}>{p}</li>
                    ))}
                </ul>
            </div>
            <div className="border p-4 h-64 overflow-y-auto">
                {messages.map((message, index) => (
                    <pre key={index} className="mb-2 whitespace-pre-wrap break-words">
                        {message}
                    </pre>
                ))}
            </div>
        </div>
    );
}