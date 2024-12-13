// utils/redis.js
import { createClient } from "redis";

const client = createClient({ url: process.env.REDIS_URL });
client.connect();

export async function getSessionData(sessionId: any) {
  return await client.get(`session:${sessionId}`);
}

export async function setSessionData(sessionId: any, data: any) {
  return await client.set(`session:${sessionId}`, JSON.stringify(data));
}
