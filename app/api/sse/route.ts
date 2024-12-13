import { NextRequest } from 'next/server';
import eventBus from '@/utils/eventBus';
export const dynamic = 'force-dynamic';


export async function GET(req: NextRequest) {
	console.log('GET request received');
	const responseStream = new TransformStream();
	const writer = responseStream.writable.getWriter();
	const encoder = new TextEncoder();

	const sendEvent = (event: string, data: any) => {
		console.log(`Sending event: ${event}, data: ${JSON.stringify(data)}`);
		writer.write(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
	};

	const newUserHandler = (data: { userId: string, email: string }) => {
		console.log(`New user processed: ${JSON.stringify(data)}`);
		sendEvent('newUserProcessed', data);
	};

	eventBus.on('newUserProcessed', newUserHandler);

	// Send a keep-alive message every 10 seconds
	const keepAliveInterval = setInterval(() => {
		console.log('Sending keep-alive message');
		sendEvent('keep-alive', { time: new Date().toISOString() });
	}, 10000);

	req.signal.addEventListener('abort', () => {
		console.log('Request aborted');
		clearInterval(keepAliveInterval);
		eventBus.off('newUserProcessed', newUserHandler);
	});

	return new Response(responseStream.readable, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			'Connection': 'keep-alive',
		},
	});
}