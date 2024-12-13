'use client'
import { getOrderHistory } from '@/actions/order.server'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import React, { useEffect, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import Loader from '@/components/global/Loader'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { getValidID } from '@/utils/helpers'
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider'
import { DataTable } from './components/data-table'
import { formatDate } from '@/utils/formatter'
import { Badge } from '@/components/ui/badge'
import './order-history.css'

export type CustomerHistoryData = {
  product: any
  amount: number
  id: number
  package_id: string
  purchase_date: string
  user_id: string
  user: {}[]
  metaData?: {
    installmentNumber?: number
    subscriptionId?: string
  }
  iterations?: any[]
}
const supabase = createClient()

const HistoryPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter()
  const { user, inspectUserId, isAdmin, isLoading, setAdminInspectUserId } =
    useSupabaseUser()
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true)
  const [historyData, setHistoryData] = useState<CustomerHistoryData[]>([])
  const [selectedSubscriptionId, setSelectedSubscriptionId] =
    useState<string>('')

  const installments = historyData?.filter(
    (item: any) => item?.metaData?.subscriptionId === selectedSubscriptionId,
  )

  const selectedSubscription =
    installments?.find(
      (installment) =>
        installment?.metaData?.subscriptionId === selectedSubscriptionId,
    ) || false

  const fetchData = async () => {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (isLoading) {
      return
    }

    if (sessionError || !session) {
      router.push('/login')
      return
    }
    if (!user) {
      router.push('/not-authorized')
      return
    }
    let validatedUserId: string | null = null
    if (inspectUserId) {
      validatedUserId = inspectUserId
    } else {
      //if there is not inspectUserId we take it from the URL
      validatedUserId = getValidID(params.id)

      //if validatedUserId is not valid we take if from user?.id
      if (!validatedUserId && user?.id) {
        validatedUserId = getValidID(user.id)
      }
    }

    // Populate data
    if (validatedUserId) {
      // if URL id is not the same then the user
      if (user.id !== validatedUserId) {
        //check if user is admin
        if (!isAdmin) {
          router.push('/not-authorized')
          return
        } else {
          //is admin
          if (validatedUserId !== params.id) {
            router.replace(`/profile/${validatedUserId}`)
          }
          //set validatedUserId
          setAdminInspectUserId(validatedUserId)
        }
      }

      const { data } = await getOrderHistory(validatedUserId)
      if (data) {
        setHistoryData(
          groupPurchases({
            purchases: data,
          }),
        )
      }
    }

    setIsPageLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [
    params.id,
    router,
    user,
    inspectUserId,
    isAdmin,
    isLoading,
    setAdminInspectUserId,
  ])

  interface Product {
    name: string
  }

  interface MetaData {
    subscriptionId?: string
  }

  interface RowData {
    name: string
    id: number
    purchase_date: string | null
    product: Product
    amount: number
    metaData: MetaData | null
  }

  const handleShowInstallment = (subscriptionId: string) => () => {
    setSelectedSubscriptionId(subscriptionId)
  }

  const columns: ColumnDef<RowData>[] = [
    {
      accessorKey: 'id',
      header: 'Order ID',
      cell: ({ row }) => {
        return (
          <div>
            <span>Order-{row?.original?.id}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'product.name',
      header: 'Product',
      cell: ({ row }) => {
        return (
          <div>
            <span>{row?.original?.product?.name} </span>
            {row?.original?.metaData?.subscriptionId && (
              <Badge variant="outline">
                On Payment Plan - ${(row?.original?.amount / 100).toFixed(2)} /
                {row?.original?.product?.name === 'Grandmaster Tier'
                  ? ' $1997'
                  : row?.original?.product?.name === 'Master'
                  ? ' $1497'
                  : ' $997'}
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'purchase_date',
      header: 'Purchase Date',
      cell: ({ row }) => {
        return (
          <div>
            <span>{formatDate(row?.original?.purchase_date)}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => {
        return (
          <div>
            <span>$ {(row?.original?.amount / 100).toFixed(2)}</span>
          </div>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <div className="">
            {row?.original?.metaData &&
              row?.original?.metaData?.subscriptionId && (
                <span
                  onClick={handleShowInstallment(
                    row?.original?.metaData &&
                      row?.original?.metaData?.subscriptionId,
                  )}
                  className={`viewPlanText ${
                    row?.original?.metaData?.subscriptionId
                      ? 'cursor-pointer'
                      : ''
                  }`}
                >
                  View Plan
                </span>
              )}
          </div>
        )
      },
    },
  ]

  interface PaymentHistory {
    label: string
    date: string
    amount: number
    isPaid: boolean
  }

  const paymentHistoryColumn: ColumnDef<PaymentHistory>[] = [
    {
      accessorKey: 'payments',
      header: 'Payments',
      cell: ({ row }) => {
        return (
          <div>
            <span>{row?.original?.label}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => {
        return (
          <div>
            <span>{row?.original?.date}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => {
        return (
          <div>
            <span>
              ${' '}
              {selectedSubscription &&
                (selectedSubscription?.amount / 100).toFixed(2)}
            </span>
          </div>
        )
      },
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => {
        return (
          <div className="actionsDiv">
            <Badge variant={row?.original?.isPaid ? 'default' : 'outline'}>
              {row?.original?.isPaid ? 'PAID' : 'UNPAID'}
            </Badge>
          </div>
        )
      },
    },
  ]

  if (isLoading || isPageLoading) {
    return (
      <div className="bg-white flex items-center justify-center fixed z-50 w-[75%] h-[400px]">
        <Loader /> <span>Loading...</span>
      </div>
    )
  }

  if (!historyData || historyData.length === 0) {
    return (
      <div className="bg-white flex items-top justify-center min-h-screen  z-50 w-full">
        No order history found
      </div>
    )
  }

  return (
    <div>
      {!selectedSubscription ? (
        <div className="">
          <div>
            <h3 className="text-lg font-medium">Order history</h3>
          </div>

          <DataTable columns={columns} data={historyData} />
        </div>
      ) : (
        <div className="">
          <div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem
                  style={{ cursor: 'pointer', color: '#71717A' }}
                  onClick={() => setSelectedSubscriptionId('')}
                >
                  Order History
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem style={{ color: '#09090B' }}>
                  Payment Plan
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <DataTable
            columns={paymentHistoryColumn}
            data={selectedSubscription?.iterations}
            classTableCell={'classTableCell'}
            classTableHead={'classTableHead'}
          />
        </div>
      )}
    </div>
  )
}

export default HistoryPage

const groupPurchases = ({
  purchases,
}: {
  purchases: CustomerHistoryData[]
}): CustomerHistoryData[] => {
  const result: CustomerHistoryData[] = []

  const grouped = purchases.reduce(
    (
      acc: { [key: string]: CustomerHistoryData & { iterations: any } },
      purchase,
    ) => {
      const subscriptionId = purchase?.metaData?.subscriptionId

      if (subscriptionId) {
        if (!acc[subscriptionId]) {
          // Initialize a group with the first record
          acc[subscriptionId] = {
            ...purchase,
            iterations: [],
          }
        }
        // Push the current installment into the iterations array

        acc?.[subscriptionId]?.iterations?.push?.(purchase)
      } else {
        // Add standalone products directly to the result
        result?.push?.(purchase)
      }
      return acc
    },
    {},
  )
  // Generate consistent 4-iteration structure for grouped subscriptions

  const groupedValues = Object.values(grouped)

  for (const group of groupedValues) {
    const dateString = group.iterations[0]?.purchase_date
    const dateObject = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
    const firstInstallmentOn = dateObject
      .toLocaleDateString('en-GB', options)
      .replace(',', '')
    const firstInstallmentDate = new Date(firstInstallmentOn)
    const dates = getInstallmentDates(firstInstallmentDate, 3)

    const iterations = Array(4)
      .fill(null)
      .map((_, index) => {
        const installment = group?.iterations.find(
          (item: any) => item.metaData?.installmentNumber === index + 1,
        )

        return {
          label: `${['First', 'Second', 'Third', 'Fourth'][index]} Payment`,
          isPaid: !!installment,
          amount: ((installment?.amount ?? 0) / 100).toFixed(2),
          date: installment?.purchase_date
            ? formatDateFunc(new Date(installment?.purchase_date))
            : dates[index],
        }
      })

    group.iterations = iterations
    result.push(group)
  }
  return result
}

const formatDateFunc = (date: Date): string =>
  date
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .replace(',', '')

const getInstallmentDates = (
  startDate: Date,
  numberOfInstallments: number,
): string[] => {
  return [
    formatDateFunc(startDate),
    ...Array.from({ length: numberOfInstallments }, (_, i) => {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + (i + 1) * 31)
      return formatDateFunc(date)
    }),
  ]
}
