'use client'

import { useQuery } from 'react-query'
import { getCustomers } from '@/actions/customer.server'
import Loader from '@/components/global/Loader'
import withAuth from '@/components/withAuth'

import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/admin/user-table-new'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/utils/formatter'
import { CustomerUser } from '@/types/supabase.tables'
import { useEffect, useState } from 'react'
import { UserDetailsDialog } from '@/components/admin/user-details-dialog'

// Column definition
export const columns: ColumnDef<CustomerUser>[] = [
  {
    accessorKey: 'full_name',
    header: 'Name',
    cell: ({ row }) => (
      <div className="flex gap-2 items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src={row.original?.avatar_url || ''} alt="Avatar" />
          <AvatarFallback>
            {row.original?.full_name
              ? row.original?.full_name.substring(0, 2)
              : 'NA'}
          </AvatarFallback>
        </Avatar>
        <span>{row.original?.full_name}</span>
      </div>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phone',
    header: 'Phone Number',
  },
  {
    accessorKey: 'old_user_id',
    header: 'User Metadata',
    cell: ({ row }: any) => (
      <div className="flex gap-1">
        <Badge variant={'outline'} className="rounded-xl">
          {row.original?.old_user_id ? 'Old' : 'New'}
        </Badge>
        {row.original?.plan_name && (
          <Badge variant={'outline'} className="rounded-xl">
            {row.original?.plan_name}
          </Badge>
        )}

        {row.original?.meta && (
          <Badge variant={'outline'} className="rounded-xl">
            {row.original?.meta}
          </Badge>
        )}

        {row.original?.upcoming_event_start_time && (
          <Badge variant={'outline'} className="rounded-xl">
            {formatDate(row.original?.upcoming_event_start_time)}
          </Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'last_logged_in',
    header: 'Last Sign In',
    cell: ({ row }: any) => formatDate(row.original?.last_logged_in) || 'N/A',
  },
  {
    accessorKey: 'purchased_plan',
    header: 'Last Purchase',
    cell: ({ row }: any) => `$ ${row.original?.purchased_plan || 0}`,
  },
]

function CustomersClientPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<CustomerUser | null>(null)

  const [sortDirection, setSortDirection] = useState<{
    [key in any]: 'asc' | 'desc'
  }>({
    'user(old_user_id)': 'asc',
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const pageSize = 100

  const {
    data: customers,
    isLoading,
    refetch: customerRefetch,
  } = useQuery({
    queryKey: ['customers', currentPage],
    queryFn: () =>
      getCustomers({
        pageParam: currentPage,
        searchQuery: searchQuery,
        sortDirection,
      }),
  })

  useEffect(() => {
    customerRefetch()
  }, [searchQuery, currentPage])

  const fetchData = (
    page: number,
    pageSize: number,
    searchText: string = '',
  ) => {
    setSearchQuery(searchText)
    setCurrentPage(page)
    // customerRefetch()
  }

  const handleRowClick = (user: CustomerUser) => {
    setSelectedUser(user)
    setIsDialogOpen(true)
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 bg-gray-50">
      <div className="flex flex-wrap items-center justify-between space-y-2">
        <h2 className="text-lg font-medium tracking-tight">
          Customers {isLoading ? <Loader /> : <span>({customers?.count})</span>}
        </h2>
      </div>
      <DataTable
        columns={columns}
        data={customers?.data || []}
        handleRowClick={handleRowClick}
        totalRows={customers?.count || 0}
        fetchData={fetchData}
        currentPage={currentPage}
        setPageIndex={setCurrentPage}
        pageSize={pageSize}
        isLoading={isLoading}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <UserDetailsDialog
        user={selectedUser}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        afterSave={() => {
          customerRefetch()
        }}
      />
    </div>
  )
}

export default withAuth(500)(CustomersClientPage)
