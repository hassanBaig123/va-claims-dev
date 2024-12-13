'use client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useState } from 'react'
import { UserDetailsDialog } from '@/components/admin/user-details-dialog'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAngleDown,
  faAngleUp,
  faAnglesUpDown,
} from '@fortawesome/pro-solid-svg-icons'
import { useQuery } from 'react-query'
import { getCustomers } from '@/actions/customer.server'
import { formatDate } from '@/utils/formatter'
import Loader from '../global/Loader'
import { CustomerUser, User } from '@/types/supabase.tables'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

const sortFunction = (a: { user_id: number }, b: { user_id: number }) =>
  a.user_id - b.user_id

export default function UserTable({
  totalCustomerCount,
}: {
  totalCustomerCount: number
}) {
  const [selectedUser, setSelectedUser] = useState<CustomerUser | null>(null)
  const [sortDirection, setSortDirection] = useState<{
    [key in any]: 'asc' | 'desc'
  }>({
    'user(old_user_id)': 'asc',
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [tempSearchQuery, setTempSearchQuery] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 10

  const {
    data: customers,
    isLoading,
    refetch: customerRefetch,
  } = useQuery({
    queryKey: ['customers', currentPage, searchQuery, sortDirection],
    queryFn: async (ctx) =>
      await getCustomers({
        pageParam: currentPage,
        searchQuery,
        sortDirection,
      }),
  })

  const handleSort = (column: any) => {
    const newDirection = sortDirection[column] === 'asc' ? 'desc' : 'asc'
    setSortDirection({ [column]: newDirection })
  }

  const handleRowClick = (user: CustomerUser) => {
    setSelectedUser(user)
    setIsDialogOpen(true)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempSearchQuery(e.target.value)
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setSearchQuery(tempSearchQuery)
    setSortDirection({ 'user(old_user_id)': 'asc' })
    setCurrentPage(1) // Reset to the first page
  }

  const handleResetSearch = () => {
    setTempSearchQuery('')
    setSearchQuery('')
    setSortDirection({ 'user(old_user_id)': 'asc' })
    setCurrentPage(1) // Reset to the first page
  }

  const indexOfLastItem = currentPage * itemsPerPage

  return (
    <div>
      <UserDetailsDialog
        user={selectedUser}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        afterSave={() => {
          customerRefetch()
        }}
      />
      <form onSubmit={handleSearch} className="flex justify-end space-x-2 my-4">
        <Input
          type="text"
          placeholder="Search users..."
          value={tempSearchQuery}
          onChange={handleSearchChange}
          className="w-1/4 bg-gray-50"
        />
        <Button type="submit">Search</Button>
        <Button type="button" onClick={handleResetSearch}>
          Reset
        </Button>
        {/* Reset button added */}
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="sortable"
              data-sort="user(full_name)"
              role="button"
              tabIndex={2}
              onClick={() => handleSort('user(full_name)')}
            >
              Name
              {sortDirection['user(full_name)'] ? (
                sortDirection['user(full_name)'] === 'asc' ? (
                  <FontAwesomeIcon icon={faAngleUp} className="ml-1" />
                ) : (
                  <FontAwesomeIcon icon={faAngleDown} className="ml-1" />
                )
              ) : (
                <FontAwesomeIcon icon={faAnglesUpDown} className="ml-1" />
              )}
            </TableHead>

            <TableHead
              className="sortable"
              data-sort="user(email)"
              role="button"
              tabIndex={3}
              onClick={() => handleSort('user(email)')}
            >
              Email
              {sortDirection['user(email)'] ? (
                sortDirection['user(email)'] === 'asc' ? (
                  <FontAwesomeIcon icon={faAngleUp} className="ml-1" />
                ) : (
                  <FontAwesomeIcon icon={faAngleDown} className="ml-1" />
                )
              ) : (
                <FontAwesomeIcon icon={faAnglesUpDown} className="ml-1" />
              )}
            </TableHead>
            <TableHead role="button" tabIndex={0}>
              Phone Number
            </TableHead>

            <TableHead
              className="text-right sortable"
              data-sort="user(last_logged_in)"
              role="button"
              tabIndex={4}
              onClick={() => handleSort('user(last_logged_in)')}
            >
              WordPress User
              {sortDirection['user(last_logged_in)'] ? (
                sortDirection['user(last_logged_in)'] === 'asc' ? (
                  <FontAwesomeIcon icon={faAngleUp} className="ml-1" />
                ) : (
                  <FontAwesomeIcon icon={faAngleDown} className="ml-1" />
                )
              ) : (
                <FontAwesomeIcon icon={faAnglesUpDown} className="ml-1" />
              )}
            </TableHead>

            <TableHead
              className="text-right sortable"
              data-sort="user(last_logged_in)"
              role="button"
              tabIndex={5}
              onClick={() => handleSort('user(last_logged_in)')}
            >
              Last Sign In
              {sortDirection['user(last_logged_in)'] ? (
                sortDirection['user(last_logged_in)'] === 'asc' ? (
                  <FontAwesomeIcon icon={faAngleUp} className="ml-1" />
                ) : (
                  <FontAwesomeIcon icon={faAngleDown} className="ml-1" />
                )
              ) : (
                <FontAwesomeIcon icon={faAnglesUpDown} className="ml-1" />
              )}
            </TableHead>

            <TableHead
              className="text-right sortable"
              data-sort="user(last_logged_in)"
              role="button"
              tabIndex={6}
              onClick={() => handleSort('user(last_logged_in)')}
            >
              Last Purchase
              {sortDirection['user(last_logged_in)'] ? (
                sortDirection['user(last_logged_in)'] === 'asc' ? (
                  <FontAwesomeIcon icon={faAngleUp} className="ml-1" />
                ) : (
                  <FontAwesomeIcon icon={faAngleDown} className="ml-1" />
                )
              ) : (
                <FontAwesomeIcon icon={faAnglesUpDown} className="ml-1" />
              )}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading && customers && customers.data.length > 0 ? (
            customers?.data.map((data, index) => (
              <TableRow
                key={data.user_id}
                onClick={() => {
                  handleRowClick(data)
                }}
                className="cursor-pointer"
              >
                <TableCell>
                  <div className="flex gap-2 items-center">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={data?.avatar_url || '/avatars/default.png'}
                        alt="Avatar"
                      />
                      <AvatarFallback>
                        {data?.full_name
                          ? data?.full_name?.substring(0, 2)
                          : 'NA'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="">{data?.full_name}</span>
                  </div>
                </TableCell>

                <TableCell>{data.email}</TableCell>
                <TableCell>{data?.phone}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={'outline'} className="rounded-xl">
                    {data?.old_user_id ? 'Old' : 'New'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {formatDate(data.last_logged_in)}
                </TableCell>

                <TableCell className="text-right">
                  $ {data?.purchased_plan}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="cursor-pointer bg-muted/50 ">
              <TableCell colSpan={6} className="font-medium text-center py-24">
                {isLoading ? <Loader /> : 'No Data Found.'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex justify-center gap-3 items-center mt-4">
        <Button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
          {'<<'}
        </Button>

        <Button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {'<'}
        </Button>
        <span>
          Page {currentPage} of{' '}
          {Math.ceil((customers?.count || 0) / itemsPerPage)}
        </span>
        <Button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={
            currentPage === Math.ceil((customers?.count || 0) / itemsPerPage)
          }
        >
          {'>'}
        </Button>

        <Button
          onClick={() =>
            setCurrentPage(Math.ceil((customers?.count || 0) / itemsPerPage))
          }
          disabled={
            currentPage === Math.ceil((customers?.count || 0) / itemsPerPage)
          }
        >
          {'>>'}
        </Button>
      </div>
    </div>
  )
}
