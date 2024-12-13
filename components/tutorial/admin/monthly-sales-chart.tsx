"use client"

import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend, LegendProps } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const dailysales =
  [
    ...Array.from({ length: 30 }, (_, i) => ({
      name: `${i + 1}`,
      lastmonth: Math.floor(Math.random() * 16), // Random sales number between 200 and 1200
      thismonth: Math.floor(Math.random() * 16), // Placeholder for days in this month
    }))
  ]

export function MonthlySales() {
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const currentMonth = new Date().getMonth();
  const currentMonthName = monthNames[currentMonth];
  return (
      <Card className="col-span-4 sm:col-span-2">
        <CardHeader>
          <CardTitle>Daily Sales</CardTitle>
          <CardDescription>
            {currentMonthName} {new Date().getFullYear()}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 -ml-6">
          <div className="h-[200px] w-full">
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
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Average
                              </span>
                              <span className="font-bold text-muted-foreground">
                                {payload[0].value}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Today
                              </span>
                              <span className="font-bold">
                                {payload[1].value}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    }

                    return null
                  }}
                />
                <Line
                  type="monotone"
                  strokeWidth={4}
                  dataKey="lastmonth"
                  activeDot={{
                    r: 6,
                  }}
                  style={
                    {
                      opacity: 0.50,
                    } as React.CSSProperties
                  }
                />
                <Line
                  type="monotone"
                  dataKey="thismonth"
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