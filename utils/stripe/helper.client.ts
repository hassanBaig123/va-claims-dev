import { SalesDataItem } from '@/components/admin/overview'
import Stripe from 'stripe'

export const getHourlyTimestamp = (hoursAgo: number): number => {
  // Get the current time in UTC
  const now = new Date().getTime()
  // Subtract the specified number of hours and convert to Unix timestamp
  return Math.floor((now - hoursAgo * 3600 * 1000) / 1000)
}

export async function getFinancialMetrics(payments: Stripe.PaymentIntent[]) {
  try {
    const totalRevenue = payments.reduce(
      (acc, payment) => acc + payment.amount_received,
      0,
    )
    const subscriptionCount = payments.filter(
      (payment) => payment.metadata.subscription === 'true',
    ).length

    return {
      totalRevenue: totalRevenue / 100, // Convert from cents to dollars
      subscriptionCount,
      salesCount: payments.length - subscriptionCount,
    }
  } catch (error) {
    console.error('Failed to retrieve financial metrics:', error)
    throw new Error('Failed to retrieve financial metrics')
  }
}

export async function getMonthlySalesData(
  payment: Stripe.PaymentIntent[],
): Promise<SalesDataItem[]> {
  return fetchAndAggregateSalesData('monthly', payment)
}

export async function getQuarterlySalesData(
  payment: Stripe.PaymentIntent[],
): Promise<SalesDataItem[]> {
  return fetchAndAggregateSalesData('quarterly', payment)
}

async function fetchAndAggregateSalesData(
  period: any,
  payments: Stripe.PaymentIntent[],
) {
  // Initialize an object to hold aggregated sales data
  const salesData: any = {}

  payments.forEach((payment) => {
    const created = new Date(payment.created * 1000)
    const amount = payment.amount

    let key: any

    if (period === 'monthly') {
      key = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(
        2,
        '0',
      )}`
    } else if (period === 'quarterly') {
      const quarter = Math.floor(created.getMonth() / 3) + 1
      key = `${created.getFullYear()}-Q${quarter}`
    }

    if (!salesData[key]) {
      salesData[key] = 0
    }

    salesData[key] += amount
  })

  // Convert sales data object to an array
  const salesDataArray = Object.keys(salesData).map((key) => {
    return {
      name: key,
      total: salesData[key] / 100, // Convert from cents to dollars
    }
  })

  // Sort the array by name (date)
  salesDataArray.sort((a, b) => a.name.localeCompare(b.name))

  return salesDataArray
}

export async function getRecentSales(payments: Stripe.PaymentIntent[]) {
  try {
    return payments.map((payment) => ({
      customerEmail: (payment.customer as Stripe.Customer).email,
      name: (payment.customer as Stripe.Customer)?.name || 'Anonymous',
      amount: payment.amount_received / 100, // Convert from cents to dollars
      currency: payment.currency.toUpperCase(),
    }))
  } catch (error) {
    console.error('Failed to retrieve recent sales:', error)
    return []
  }
}

export const getPreviousMonthTimestamps = () => {
  const now = new Date()
  const startOfMonth = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1),
  )
  const endOfMonth = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0),
  )

  return {
    fromTimestamp: Math.floor(startOfMonth.getTime() / 1000),
    toTimestamp: Math.floor(endOfMonth.getTime() / 1000),
  }
}

export const getLastMonthTimestamp = (): number => {
  const now = new Date()
  const startOfLastMonth = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1),
  )
  const endOfLastMonth = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0),
  )

  // Calculate the total hours in the last month
  const hoursInLastMonth = Math.floor(
    (endOfLastMonth.getTime() - startOfLastMonth.getTime()) / (1000 * 60 * 60),
  )

  // Return the Unix timestamp for the start of the last month
  return Math.floor((now.getTime() - hoursInLastMonth * 60 * 60 * 1000) / 1000)
}

export function filterPaymentsByTimestamp(
  paymentIntents: Stripe.PaymentIntent[],
  fromTimestamp: number,
): Stripe.PaymentIntent[] {
  return paymentIntents.filter((payment) => payment.created >= fromTimestamp)
}

export function filterPaymentsByDateRange(
  paymentIntents: Stripe.PaymentIntent[],
  fromTimestamp: number,
  toTimestamp: number,
): Stripe.PaymentIntent[] {
  return paymentIntents.filter(
    (payment) =>
      payment.created >= fromTimestamp && payment.created < toTimestamp,
  )
}

export function calculatePercentageChange(
  currentValue: number,
  previousValue: number,
) {
  // Check if previousValue is not zero
  if (previousValue === 0) {
    return '0'
  }

  // Calculate the difference
  const difference = currentValue - previousValue

  // Calculate the percentage change
  const percentageChange = (difference / previousValue) * 100

  // Return the percentage change
  return percentageChange.toFixed(2)
}

export function isPositive(value: string) {
  let __value = Number(value)
  if (typeof __value != 'number') {
    return false
  }

  if (__value < 0) {
    return false
  }

  return true
}

export function calculateDailyTotalSales(
  paymentIntents: Stripe.PaymentIntent[],
): { date: string; totalSales: number; count: number }[] {
  // Group the payment intents by date in UTC
  const salesByDate: { [key: string]: { totalSales: number; count: number } } =
    {}

  paymentIntents.forEach((payment) => {
    const date = new Date(payment.created * 1000)

    // Use UTC date components
    const formattedDate = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
    ).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC', // Ensures the date is interpreted as UTC
    })

    if (!salesByDate[formattedDate]) {
      salesByDate[formattedDate] = { totalSales: 0, count: 0 }
    }
    salesByDate[formattedDate].totalSales += payment.amount / 100
    salesByDate[formattedDate].count += 1
  })

  // Convert the object to an array of { date, totalSales, count } objects
  return Object.entries(salesByDate).map(([date, { totalSales, count }]) => ({
    date,
    totalSales,
    count,
  }))
}
