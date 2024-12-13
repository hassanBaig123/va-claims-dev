// utils/redis.js
import { createClient } from 'redis';

const client = createClient({ url: 'redis://localhost:6379' });
client.connect();

export async function getSessionData(sessionId: any) {
  return await client.get(`session:${sessionId}`);
}

export async function setSessionData(sessionId: any, data: any) {
  return await client.set(`session:${sessionId}`, JSON.stringify(data));
}
