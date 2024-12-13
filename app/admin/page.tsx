'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CalendarDateRangePicker } from '@/components/admin/date-range-picker'
import { Last12MonthsSales, SalesDataItem } from '@/components/admin/overview'
import { RecentSales } from '@/components/admin/recent-sales'
import { MonthlySales } from '@/components/admin/monthly-sales-chart'
import { getDailySalesTrends } from '@/utils/stripe/server'
import { useEffect, useState } from 'react'
import Stripe from 'stripe'
import {
  calculatePercentageChange,
  filterPaymentsByDateRange,
  filterPaymentsByTimestamp,
  getFinancialMetrics,
  getHourlyTimestamp,
  getLastMonthTimestamp,
  getMonthlySalesData,
  getPreviousMonthTimestamps,
  getQuarterlySalesData,
  getRecentSales,
  isPositive,
} from '@/utils/stripe/helper.client'
import { fetchAllPaymentIntentList } from '@/utils/stripe/helper.server'
import Loader from '@/components/global/Loader'
import { ArrowDownIcon, ArrowUpIcon } from '@radix-ui/react-icons'
import classNames from '@/utils/classNames'
import withAuth from '@/components/withAuth'

const DashboardPage = () => {
  const [allData, setAllData] = useState<Stripe.PaymentIntent[]>([])
  const [lastMonthData, setLastMonthData] = useState<Stripe.PaymentIntent[]>([])
  const [financialMetrics, setFinancialMetrics] = useState({
    totalRevenue: 0,
    subscriptionCount: 0,
    salesCount: 0,
  })
  const [extraAnalysis, setExtraAnalysis] = useState({
    fromLastMonthRevenue: '0',
    fromLastMonthSub: '0',
    fromLastMonthSale: '0',
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true)
      const fromTimestamp = getHourlyTimestamp(24 * 365) // Starting timestamp
      const totalPeriodHours = 24 * 365 // Total period in hours (1 year)
      const chunkSize = totalPeriodHours / 6 // Divide the total period into 6 chunks

      let payments: Stripe.PaymentIntent[] = []

      for (let i = 0; i < 6; i++) {
        const chunkStartTimestamp = fromTimestamp + i * chunkSize * 3600 // Start of the chunk
        const chunkEndTimestamp = chunkStartTimestamp + chunkSize * 3600 // End of the chunk

        // Fetch payment intents for the current chunk
        const paymentsChunk = await fetchAllPaymentIntentList(
          chunkStartTimestamp,
          chunkEndTimestamp,
        )
        payments = payments.concat(paymentsChunk)
      }

      setAllData(payments)

      //get last months data...

      const {
        fromTimestamp: last_fromTimestamp,
        toTimestamp: last_toTimestamp,
      } = getPreviousMonthTimestamps()
      const __lastMonthsData = filterPaymentsByDateRange(
        payments,
        last_fromTimestamp,
        last_toTimestamp,
      )
      setLastMonthData(__lastMonthsData)

      setIsLoading(false)
    }
    fetchAllData()
  }, [])

  useEffect(() => {
    const fetchFinancialMetrics = async () => {
      try {
        const filteredData = filterPaymentsByTimestamp(
          allData,
          getLastMonthTimestamp(),
        )
        const metrics = await getFinancialMetrics(filteredData) // Assuming this function is properly imported or available
        setFinancialMetrics(metrics)
      } catch (error) {
        console.error('Failed to fetch financial metrics', error)
      }
    }

    fetchFinancialMetrics()
  }, [allData])

  const [monthlyData, setMonthlyData] = useState<SalesDataItem[]>([])
  const [quarterlyData, setQuarterlyData] = useState<SalesDataItem[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const monthly = await getMonthlySalesData(allData)
      const quarterly = await getQuarterlySalesData(allData)
      setMonthlyData(monthly)
      setQuarterlyData(quarterly)
    }

    fetchData()
  }, [allData])

  const [recentSales, setRecentSales] = useState([])

  useEffect(() => {
    const fetchRecentSales = async () => {
      try {
        const filteredData = filterPaymentsByTimestamp(
          allData,
          getHourlyTimestamp(24),
        )
        const sales = await getRecentSales(filteredData) // Make sure to import this function
        setRecentSales(sales as any)
      } catch (error) {
        console.error('Failed to fetch recent sales:', error)
      }
    }

    fetchRecentSales()
  }, [allData])

  useEffect(() => {
    const lastMonthRevenue =
      lastMonthData.reduce((acc, payment) => acc + payment.amount_received, 0) /
      100

    const lastMonthSub = lastMonthData.filter(
      (payment) => payment.metadata.subscription === 'true',
    ).length
    const __lastMonthRevenuePercent = calculatePercentageChange(
      financialMetrics.totalRevenue,
      lastMonthRevenue,
    )

    const __lastMonthSale = calculatePercentageChange(
      financialMetrics.salesCount,
      lastMonthData.length,
    )

    const __lastMonthSub = calculatePercentageChange(
      financialMetrics.subscriptionCount,
      lastMonthSub,
    )

    setExtraAnalysis({
      fromLastMonthRevenue: __lastMonthRevenuePercent,
      fromLastMonthSale: __lastMonthSale,
      fromLastMonthSub: __lastMonthSub,
    })
  }, [allData, financialMetrics, lastMonthData])

  if (isLoading) {
    return (
      <div className="bg-white flex items-center justify-center min-h-screen fixed z-50 w-full">
        <Loader /> <span>Analyzing data..</span>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 bg-gray-50">
      <div className="flex flex-wrap items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex flex-wrap items-center space-x-2">
          <CalendarDateRangePicker />
          <Button>Download</Button>
        </div>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="truncate text-sm font-medium text-gray-500">
              Total Revenue
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="mt-1 text-3xl font-semibold tracking-tight text-muted-foreground">
              ${financialMetrics.totalRevenue.toFixed(2)}
            </div>
            <p
              className={classNames(
                isPositive(extraAnalysis.fromLastMonthRevenue)
                  ? 'text-green-600'
                  : 'text-red-600',
                'flex gap-2 items-baseline text-sm font-semibold leading-6 text-muted-foreground',
              )}
            >
              {isPositive(extraAnalysis.fromLastMonthRevenue) ? (
                <ArrowUpIcon
                  className="h-5 w-5 flex-shrink-0 self-center text-green-500"
                  aria-hidden="true"
                />
              ) : (
                <ArrowDownIcon
                  className="h-5 w-5 flex-shrink-0 self-center text-red-500"
                  aria-hidden="true"
                />
              )}
              {extraAnalysis.fromLastMonthRevenue}{' '}
              <span className="font-normal text-muted-foreground">
                {' '}
                from last month
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="truncate text-sm font-medium text-gray-500">
              Subscriptions
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="mt-1 text-3xl font-semibold tracking-tight text-muted-foreground">
              {financialMetrics.subscriptionCount}
            </div>
            <p
              className={classNames(
                isPositive(extraAnalysis.fromLastMonthSub)
                  ? 'text-green-600'
                  : 'text-red-600',
                'flex gap-2 items-baseline text-sm font-semibold leading-6 text-muted-foreground',
              )}
            >
              {isPositive(extraAnalysis.fromLastMonthSub) ? (
                <ArrowUpIcon
                  className="h-5 w-5 flex-shrink-0 self-center text-green-500"
                  aria-hidden="true"
                />
              ) : (
                <ArrowDownIcon
                  className="h-5 w-5 flex-shrink-0 self-center text-red-500"
                  aria-hidden="true"
                />
              )}
              {extraAnalysis.fromLastMonthSub}{' '}
              <span className="font-normal text-muted-foreground">
                {' '}
                from last month
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="truncate text-sm font-medium text-gray-500">
              Sales
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="mt-1 text-3xl font-semibold tracking-tight text-muted-foreground">
              {financialMetrics.salesCount}
            </div>
            <p
              className={classNames(
                isPositive(extraAnalysis.fromLastMonthSale)
                  ? 'text-green-600'
                  : 'text-red-600',
                'flex gap-2 items-baseline text-sm font-semibold leading-6 text-muted-foreground',
              )}
            >
              {isPositive(extraAnalysis.fromLastMonthSale) ? (
                <ArrowUpIcon
                  className="h-5 w-5 flex-shrink-0 self-center text-green-500"
                  aria-hidden="true"
                />
              ) : (
                <ArrowDownIcon
                  className="h-5 w-5 flex-shrink-0 self-center text-red-500"
                  aria-hidden="true"
                />
              )}
              {extraAnalysis.fromLastMonthSale}{' '}
              <span className="font-normal text-muted-foreground">
                {' '}
                from last month
              </span>
            </p>
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="truncate text-sm font-medium text-gray-500">
              Active Now
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="mt-1 text-3xl font-semibold tracking-tight text-muted-foreground">
              +573
            </div>
            <p className="text-sm font-medium leading-6 text-muted-foreground">
              +201 since last hour
            </p>
          </CardContent>
        </Card> */}
      </div>
      <div className="grid gap-4 grid-cols-4">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Last 12 Months Sales</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Last12MonthsSales
              monthlyData={monthlyData}
              quarterlyData={quarterlyData}
            />
          </CardContent>
        </Card>
        <Card className="col-span-4 sm:col-span-2">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>
              You made {recentSales.length} sales in last 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSales sales={recentSales} />
          </CardContent>
        </Card>
        <MonthlySales allData={allData} />
      </div>
    </div>
  )
}

export default withAuth(0)(DashboardPage) //Change to 500 only for admins, for now this is set to 0
