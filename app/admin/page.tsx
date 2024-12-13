'use client';
import { Metadata } from "next"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CalendarDateRangePicker } from "@/components/admin/date-range-picker"
import { Last12MonthsSales, SalesDataItem } from "@/components/admin/overview"
import { RecentSales } from "@/components/admin/recent-sales"
import { MonthlySales } from "@/components/admin/monthly-sales-chart"
import { getDailySalesTrends, getFinancialMetrics, getMonthlySalesData, getQuarterlySalesData, getRecentSales } from "@/utils/stripe/server"
import { useEffect, useState } from "react"




export default function DashboardPage() {

  const [financialMetrics, setFinancialMetrics] = useState({
    totalRevenue: 0,
    subscriptionCount: 0,
    salesCount: 0
  });
  
  useEffect(() => {
    const fetchFinancialMetrics = async () => {
      try {
        const metrics = await getFinancialMetrics(); // Assuming this function is properly imported or available
        setFinancialMetrics(metrics);
      } catch (error) {
        console.error("Failed to fetch financial metrics:", error);
      }
    };
  
    fetchFinancialMetrics();
  }, []);

const [monthlyData, setMonthlyData] = useState<SalesDataItem[]>([]);
const [quarterlyData, setQuarterlyData] = useState<SalesDataItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const monthly = await getMonthlySalesData();
      const quarterly = await getQuarterlySalesData();
      setMonthlyData(monthly);
      setQuarterlyData(quarterly);
    };

    fetchData();
  }, []);

const [recentSales, setRecentSales] = useState([]);

useEffect(() => {
  const fetchRecentSales = async () => {
    try {
      const sales = await getRecentSales(); // Make sure to import this function
      setRecentSales(sales);
    } catch (error) {
      console.error("Failed to fetch recent sales:", error);
    }
  };

  fetchRecentSales();
}, []);

const [dailySalesTrends, setDailySalesTrends] = useState([]);
const year = new Date().getFullYear();
const month = new Date().getMonth() + 1; // JavaScript months are 0-indexed

useEffect(() => {
  const fetchDailySalesTrends = async () => {
    try {
      const trends = await getDailySalesTrends(year, month); // Ensure this function is imported
      setDailySalesTrends(trends);
    } catch (error) {
      console.error("Failed to fetch daily sales trends:", error);
    }
  };

  fetchDailySalesTrends();
}, [year, month]);

  return (
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex flex-wrap items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex flex-wrap items-center space-x-2">
              <CalendarDateRangePicker />
              <Button>Download</Button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
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
              <div className="text-2xl font-bold">${financialMetrics.totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
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
              <div className="text-2xl font-bold">{financialMetrics.subscriptionCount}</div>
                <p className="text-xs text-muted-foreground">
                  +180.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales</CardTitle>
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
                <div className="text-2xl font-bold">{financialMetrics.salesCount}</div>
                <p className="text-xs text-muted-foreground">
                  +19% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
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
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">
                  +201 since last hour
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 grid-cols-4">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Last 12 Months Sales</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Last12MonthsSales monthlyData={monthlyData} quarterlyData={quarterlyData} />
              </CardContent>
            </Card>
            <Card className="col-span-4 sm:col-span-2">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>
                  You made 265 sales this month.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales sales={recentSales} />
              </CardContent>
            </Card>
            <MonthlySales />
          </div>
        </div>
  )
}
