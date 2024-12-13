import { NextRequest } from 'next/server';
import Redis from 'ioredis';
export const dynamic = 'force-dynamic';

const redis = new Redis(process.env.REDIS_URL ? process.env.REDIS_URL : '');
const pubsub = redis.duplicate();

//TODO: Add a list of patterns to subscribe to for this endpoint
//TODO: Add a mechanism to add a list of clients subscribing to a pattern
const clients = [];
const patterns = ["*"];

export async function GET(req: NextRequest) {
    const pattern = req.nextUrl.searchParams.get('pattern');
    if (!pattern) {
        console.log('Pattern is missing');
        return new Response('Pattern is required', { status: 400 });
    }

    console.log(`GET request received for pattern: ${pattern}`);
    const responseStream = new TransformStream();
    const writer = responseStream.writable.getWriter();
    const encoder = new TextEncoder();

    const sendEvent = (event: string, data: any) => {
        console.log(`Sending event: ${event}, data: ${JSON.stringify(data)}`);
        writer.write(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
    };

    try {
        await pubsub.psubscribe(pattern);
        console.log(`Subscribed to pattern: ${pattern}`);

        pubsub.on('pmessage', (pattern, channel, message) => {
            console.log(`Received message for pattern ${pattern}: ${message}`);
            try {
                const parsedMessage = JSON.parse(message);
                sendEvent('message', { pattern, channel, ...parsedMessage });
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        });

        // Send an initial connection event
        sendEvent('connected', { message: `Connected to pattern: ${pattern}` });

        // Send a keep-alive message every 10 seconds
        const keepAliveInterval = setInterval(() => {
            //console.log('Sending keep-alive message');
            sendEvent('keep-alive', { time: new Date().toISOString() });
        }, 10000);

        req.signal.addEventListener('abort', () => {
            console.log(`Request aborted for pattern: ${pattern}`);
            clearInterval(keepAliveInterval);
            pubsub.punsubscribe(pattern);
            pubsub.quit();
        });

        return new Response(responseStream.readable, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } catch (error) {
        console.error('Error in SSE handler:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}