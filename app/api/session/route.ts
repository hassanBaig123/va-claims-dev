// pages/api/session.js
import { NextApiRequest, NextApiResponse } from 'next';
import Redis from 'ioredis';

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  const client = new Redis(process.env.REDIS_URL as string);
  await client.connect();

  // Get the product data from the external API response
  const sessionData = await client.get('sessionData');

  // Respond with the product data
  res.status(200).json({ data: sessionData });

  // Don't forget to disconnect from Redis
  await client.disconnect();
}