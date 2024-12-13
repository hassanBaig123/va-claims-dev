import { NextResponse } from 'next/server'
// import { createClient } from 'redis';
// import { fetchAllPaymentIntentList } from "@/utils/stripe/helper.server";
// import { getHourlyTimestamp } from "@/utils/stripe/helper.client";

// const redis = createClient({
//   url: 'redis://localhost:6379'
// });

// redis.on('error', err => console.error('Redis Client Error', err));

// async function connectToRedis() {
//   if (!redis.isOpen) {
//     await redis.connect();
//   }
// }

export async function GET() {
  const cacheKey = 'admin-dashboard-data'
  const cacheTTL = 3600 // 1 hour in seconds

  // try {
  //   await connectToRedis();

  //   // Check if data is in cache
  //   const cachedData = await redis.get(cacheKey);
  //   if (cachedData && typeof cachedData === 'string') {
  //     return NextResponse.json(JSON.parse(cachedData));
  //   }

  //   // If not in cache, fetch data
  //   const fromTimestamp = getHourlyTimestamp(24 * 365);
  //   const totalPeriodHours = 24 * 365;
  //   const chunkSize = totalPeriodHours / 6;

  //   let payments: any[] = [];

  //   for (let i = 0; i < 6; i++) {
  //     const chunkStartTimestamp = fromTimestamp + i * chunkSize * 3600;
  //     const chunkEndTimestamp = chunkStartTimestamp + chunkSize * 3600;

  //     const paymentsChunk = await fetchAllPaymentIntentList(
  //       chunkStartTimestamp,
  //       chunkEndTimestamp
  //     );
  //     payments = payments.concat(paymentsChunk);
  //   }

  //   // Ensure payments is an array before sending the response
  //   if (!Array.isArray(payments)) {
  //     throw new Error('Payments data is not in the expected format');
  //   }

  //   // Cache the data
  //   await redis.set(cacheKey, JSON.stringify(payments), { EX: cacheTTL });

  //   return NextResponse.json(payments);
  // } catch (error) {
  //   console.error('Error fetching or caching data:', error);
  //   const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
  // return NextResponse.json({ error: 'Internal Server Error', message: errorMessage }, { status: 500 });
  // } finally {
  //   // Disconnect from Redis when done
  //   await redis.disconnect();
  // }

  return NextResponse.json(
    { error: 'Internal Server Error', message: 'OK' },
    { status: 200 },
  )
}
