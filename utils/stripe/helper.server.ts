'use server'

import Stripe from 'stripe'
import { stripe } from './config'

interface CacheItem {
  data: Stripe.PaymentIntent[]
  timestamp: number
}

const cache = new Map<string, CacheItem>()
const CACHE_DURATION = 4 * 60 * 60 * 1000 // 1 hour in milliseconds

export const fetchAllPaymentIntentList = async (
  fromTimestamp: number,
  toTimestamp?: number,
) => {
  const cacheKey = `${fromTimestamp}-${toTimestamp || ''}`
  const now = Date.now()
  const cachedItem = cache.get(cacheKey)

  if (cachedItem && now - cachedItem.timestamp < CACHE_DURATION) {
    console.log('Returning cached data')
    return cachedItem.data
  }

  console.log('Fetching fresh data')
  const paymentIntents = []
  let hasMore = true
  let lastId = null

  while (hasMore) {
    const params: Stripe.PaymentIntentListParams = {
      limit: 100,
      created: {
        gte: fromTimestamp,
      },
      expand: ['data.customer'],
    }

    if (toTimestamp) {
      ;(params.created as any).lte = toTimestamp
    }

    if (lastId) {
      params.starting_after = lastId
    }

    const response = await stripe.paymentIntents.list(params)

    // Filter the response to only include succeeded payment intents
    const successfulPaymentIntents = response.data.filter(
      (paymentIntent) => paymentIntent.status === 'succeeded',
    )

    paymentIntents.push(...successfulPaymentIntents)

    hasMore = response.has_more
    if (hasMore) {
      lastId = response.data[response.data.length - 1].id
    }
  }

  cache.set(cacheKey, { data: paymentIntents, timestamp: now })
  return paymentIntents
}
