// app/api/session/route.ts
import Redis from 'ioredis';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const client = new Redis(process.env.REDIS_URL as string);
  await client.connect();

  try {
    // Get the session data from Redis
    const sessionData = await client.get('sessionData');

    // Respond with the session data
    return new Response(JSON.stringify({ data: sessionData }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  } finally {
    // Ensure that Redis client disconnects
    await client.disconnect();
  }
}
