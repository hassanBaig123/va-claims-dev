'use client'

import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  Legend,
  LegendProps,
} from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Stripe from 'stripe'
import {
  calculateDailyTotalSales,
  filterPaymentsByTimestamp,
  getHourlyTimestamp,
  getLastMonthTimestamp,
} from '@/utils/stripe/helper.client'

export function MonthlySales({ allData }: { allData: Stripe.PaymentIntent[] }) {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const currentMonth = new Date().getMonth()
  const currentMonthName = monthNames[currentMonth]

  const filteredThisData = filterPaymentsByTimestamp(
    allData,
    getLastMonthTimestamp(),
  )
  const dailysales = calculateDailyTotalSales(filteredThisData.reverse())

  return (
    <Card className="col-span-4 sm:col-span-2">
      <CardHeader>
        <CardTitle>Daily Sales</CardTitle>
        <CardDescription>Last 30 Days Analysis</CardDescription>
      </CardHeader>
      <CardContent className="p-0 -ml-6">
        <div className="h-[200px] w-full pl-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={dailysales}
              margin={{
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Date:
                            </span>
                            <span className="font-semibold text-muted-foreground">
                              {payload[0].payload.date}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Sales
                            </span>
                            <span className="font-semibold text-muted-foreground">
                              ${payload[0].payload.totalSales}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Count
                            </span>
                            <span className="font-semibold text-muted-foreground">
                              {payload[0].payload.count}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  }

                  return null
                }}
              />
              {/* <Line
                type="monotone"
                strokeWidth={4}
                dataKey="lastmonth"
                activeDot={{
                  r: 6,
                }}
                style={
                  {
                    opacity: 0.5,
                  } as React.CSSProperties
                }
              /> */}
              <Line
                type="monotone"
                dataKey="totalSales"
                strokeWidth={4}
                activeDot={{
                  r: 8,
                }}
                stroke="#82ca9d"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
