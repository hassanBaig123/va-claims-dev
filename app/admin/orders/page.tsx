import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { PersonIcon } from '@radix-ui/react-icons'
import OrdersTable from '@/components/admin/orders-table'

export const metadata: Metadata = {
  title: 'Orders',
  description: 'Orders page for the admin dashboard',
}

export default function OrdersPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex flex-wrap items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
      </div>
      <div className="grid gap-4 grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <PersonIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
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
      <div className="grid gap-4">
        <Card className="col-span-4">
          <CardContent className="pl-2">
            <OrdersTable />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
