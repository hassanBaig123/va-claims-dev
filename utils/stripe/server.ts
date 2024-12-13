'use server'

import Stripe from 'stripe'
import { stripe } from '@/utils/stripe/config'
import { createClient } from '@/utils/supabase/server'
import { createOrRetrieveCustomer } from '@/utils/supabase/admin'
import {
  getURL,
  getErrorRedirect,
  calculateTrialEndUnixTimestamp,
} from '@/utils/helpers'
import { Tables } from '@/models/supabase/supabase'
import { SalesDataItem } from '@/components/admin/overview'
import { fetchAllPaymentIntentList } from './helper.server'
import { getHourlyTimestamp } from './helper.client'

type Price = Tables<'prices'>

type CheckoutResponse = {
  errorRedirect?: string
  sessionId?: string
}

export async function checkoutWithStripe(
  price: Price,
  redirectPath: string = '/account',
): Promise<CheckoutResponse> {
  try {
    // Get the user from Supabase auth
    const supabase = await createClient()
    const {
      error,
      data: { user },
    } = await supabase.auth.getUser()

    if (error || !user) {
      console.error(error)
      throw new Error('Could not get user session.')
    }

    // Retrieve or create the customer in Stripe
    let customer: string
    try {
      customer = await createOrRetrieveCustomer({
        uuid: user?.id || '',
        email: user?.email || '',
      })
    } catch (err) {
      console.error(err)
      throw new Error('Unable to access customer record.')
    }

    let params: Stripe.Checkout.SessionCreateParams = {
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer,
      customer_update: {
        address: 'auto',
      },
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      cancel_url: getURL(),
      success_url: getURL(redirectPath),
    }

    console.log(
      'Trial end:',
      calculateTrialEndUnixTimestamp(price.trial_period_days),
    )
    if (price.type === 'recurring') {
      params = {
        ...params,
        mode: 'subscription',
        subscription_data: {
          trial_end: calculateTrialEndUnixTimestamp(price.trial_period_days),
        },
      }
    } else if (price.type === 'one_time') {
      params = {
        ...params,
        mode: 'payment',
      }
    }

    // Create a checkout session in Stripe
    let session
    try {
      session = await stripe.checkout.sessions.create(params)
    } catch (err) {
      console.error(err)
      throw new Error('Unable to create checkout session.')
    }

    // Instead of returning a Response, just return the data or error.
    if (session) {
      return { sessionId: session.id }
    } else {
      throw new Error('Unable to create checkout session.')
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        errorRedirect: getErrorRedirect(
          redirectPath,
          error.message,
          'Please try again later or contact a system administrator.',
        ),
      }
    } else {
      return {
        errorRedirect: getErrorRedirect(
          redirectPath,
          'An unknown error occurred.',
          'Please try again later or contact a system administrator.',
        ),
      }
    }
  }
}

export async function createStripePortal(currentPath: string) {
  try {
    const supabase = await createClient()
    const {
      error,
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      if (error) {
        console.error(error)
      }
      throw new Error('Could not get user session.')
    }

    let customer
    try {
      customer = await createOrRetrieveCustomer({
        uuid: user.id || '',
        email: user.email || '',
      })
    } catch (err) {
      console.error(err)
      throw new Error('Unable to access customer record.')
    }

    if (!customer) {
      throw new Error('Could not get customer.')
    }

    try {
      const { url } = await stripe.billingPortal.sessions.create({
        customer,
        return_url: getURL('/account'),
      })
      if (!url) {
        throw new Error('Could not create billing portal')
      }
      return url
    } catch (err) {
      console.error(err)
      throw new Error('Could not create billing portal')
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error)
      return getErrorRedirect(
        currentPath,
        error.message,
        'Please try again later or contact a system administrator.',
      )
    } else {
      return getErrorRedirect(
        currentPath,
        'An unknown error occurred.',
        'Please try again later or contact a system administrator.',
      )
    }
  }
}

export async function getFinancialMetrics() {
  const today = new Date()
  const lastMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    today.getDate(),
  )

  try {
    const payments = await stripe.paymentIntents.list({
      created: {
        gte: Math.floor(lastMonth.getTime() / 1000),
      },
      limit: 100,
    })

    const totalRevenue = payments.data.reduce(
      (acc, payment) => acc + payment.amount_received,
      0,
    )
    const subscriptionCount = payments.data.filter(
      (payment) => payment.metadata.subscription === 'true',
    ).length

    return {
      totalRevenue: totalRevenue / 100, // Convert from cents to dollars
      subscriptionCount,
      salesCount: payments.data.length - subscriptionCount,
    }
  } catch (error) {
    console.error('Failed to retrieve financial metrics:', error)
    throw new Error('Failed to retrieve financial metrics')
  }
}

async function fetchAndAggregateSalesData(
  period: 'monthly' | 'quarterly',
): Promise<SalesDataItem[]> {
  const payments = await stripe.paymentIntents.list({
    limit: 120,
  })

  const salesData: SalesDataItem[] = []
  const aggregationMap = new Map<string, number>()

  payments.data.forEach((payment) => {
    const date = new Date(payment.created * 1000)
    let key: string

    if (period === 'monthly') {
      key = `${date.getFullYear()}-${date.getMonth() + 1}`
    } else {
      // Quarterly aggregation
      const quarter = Math.floor(date.getMonth() / 3) + 1
      key = `${date.getFullYear()}-Q${quarter}`
    }

    const currentTotal = aggregationMap.get(key) || 0
    aggregationMap.set(key, currentTotal + payment.amount_received)
  })

  aggregationMap.forEach((total, key) => {
    salesData.push({
      name: key,
      total: total / 100, // Convert from cents to dollars
    })
  })

  return salesData.sort((a, b) => a.name.localeCompare(b.name)) // Sort by period
}

export async function getMonthlySalesData(): Promise<SalesDataItem[]> {
  return fetchAndAggregateSalesData('monthly')
}

export async function getQuarterlySalesData(): Promise<SalesDataItem[]> {
  return fetchAndAggregateSalesData('quarterly')
}

export async function getRecentSales() {
  try {
    const payments = await stripe.paymentIntents.list({
      limit: 10,
    })

    return payments.data.map((payment) => ({
      customerEmail: payment.receipt_email,
      amount: payment.amount_received / 100, // Convert from cents to dollars
      currency: payment.currency.toUpperCase(),
    }))
  } catch (error) {
    console.error('Failed to retrieve recent sales:', error)
    return []
  }
}

export async function getDailySalesTrends(year: number, month: number) {
  const startOfMonth = new Date(year, month - 1, 1)
  const endOfMonth = new Date(year, month, 0)
  const daysInMonth = endOfMonth.getDate()

  const dailySales = new Array(daysInMonth).fill(0)

  const payments = await stripe.paymentIntents.list({
    created: {
      gte: Math.floor(startOfMonth.getTime() / 1000),
      lte: Math.floor(endOfMonth.getTime() / 1000),
    },
    limit: 100,
  })

  payments.data.forEach((payment) => {
    const paymentDate = new Date(payment.created * 1000)
    dailySales[paymentDate.getDate() - 1] += payment.amount_received / 100 // Convert from cents to dollars
  })

  return dailySales.map((sales, index) => ({
    day: index + 1,
    sales,
  }))
}
