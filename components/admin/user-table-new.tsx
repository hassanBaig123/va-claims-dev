'use client'
import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAnglesLeft,
  faAngleLeft,
  faAngleRight,
  faAnglesRight,
  faSearch,
} from '@fortawesome/pro-solid-svg-icons'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import Loader from '../global/Loader'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  handleRowClick: (row: TData) => void
  totalRows: number
  fetchData: (page: number, pageSize: number, searchText: string) => void
  currentPage: number
  setPageIndex: (pageIndex: number) => void
  searchQuery: string
  setSearchQuery: (text: string) => void
  pageSize?: number
  isLoading?: boolean
}

export function DataTable<TData, TValue>({
  data,
  columns,
  totalRows,
  isLoading,
  fetchData,
  currentPage,
  setPageIndex,
  pageSize = 10,
  handleRowClick,
  setSearchQuery,
}: DataTableProps<TData, TValue>) {
  const totalPages = Math.ceil(totalRows / pageSize) // Total pages
  const [columnFilters, setColumnFilters] = React.useState<any>('')

  const table = useReactTable({
    data,
    columns,
    pageCount: totalPages, // Total pages
    manualPagination: true, // Enable server-side pagination
    state: {
      pagination: {
        pageSize,
        pageIndex: currentPage - 1, // Use 0-based index for React Table
      },
    },
    onStateChange: (updater: any) => {
      const newState = updater.pagination
        ? typeof updater.pagination === 'function'
          ? updater.pagination({ pageIndex: currentPage - 1, pageSize })
          : updater.pagination
        : { pageIndex: currentPage - 1, pageSize }

      if (newState.pageIndex !== currentPage - 1) {
        const newPage = newState.pageIndex + 1 // Convert to 1-based index
        setPageIndex(newPage) // Update current page
        fetchData(newPage, pageSize, '') // Fetch data for the new page
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="rounded-md">
      <div className="flex items-center py-4">
        <div className="relative w-full max-w-sm">
          <form
            onSubmit={(event) => {
              event.preventDefault()
              setSearchQuery(columnFilters)
              setPageIndex(1)
            }}
            className="w-full"
          >
            <Input
              placeholder="Filter emails..."
              value={columnFilters}
              disabled={isLoading}
              onChange={(event) => {
                setColumnFilters(event.target.value)
                if (!event.target.value) {
                  setSearchQuery('')
                  setPageIndex(1)
                }
              }}
              className="pl-3 pr-10 py-2 w-full"
            />
            {columnFilters && (
              <button
                type="submit"
                className="absolute right-0 top-0 bottom-0 px-3 py-2 flex items-center justify-center text-gray-500 hover:text-white hover:bg-black border border-gray-300 m-1 p-2.5 rounded-r-[5px] rounded-l-none"
              >
                <FontAwesomeIcon icon={faSearch} size="1x" />
              </button>
            )}
          </form>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {!isLoading && data.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => handleRowClick(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {isLoading ? <Loader /> : 'No results.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Icons */}
      <div className="flex items-center justify-end gap-4 py-4">
        {/* First Page */}

        {/* Page Info */}
        <span className="text-sm font-normal">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setPageIndex(1)}
          disabled={currentPage === 1 || isLoading}
          className={`p-1 rounded-md border hover:bg-gray-200 px-2`}
        >
          <FontAwesomeIcon
            icon={faAnglesLeft}
            color={currentPage === 1 ? '#a4a4a4' : '#000'}
            fontSize={12}
          />
        </button>

        {/* Previous Page */}
        <button
          onClick={() => setPageIndex(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className={`p-1 rounded-md border hover:bg-gray-200 px-3`}
        >
          <FontAwesomeIcon
            icon={faAngleLeft}
            color={currentPage === 1 ? '#a4a4a4' : '#000'}
            fontSize={12}
          />
        </button>

        {/* Next Page */}
        <button
          onClick={() => setPageIndex(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className={`p-1 rounded-md border hover:bg-gray-200 px-3`}
        >
          <FontAwesomeIcon
            icon={faAngleRight}
            color={currentPage === totalPages ? '#a4a4a4' : '#000'}
            fontSize={12}
          />
        </button>

        {/* Last Page */}
        <button
          onClick={() => setPageIndex(totalPages)}
          disabled={currentPage === totalPages || isLoading}
          className={`p-1 rounded-md border hover:bg-gray-200 px-2`}
        >
          <FontAwesomeIcon
            icon={faAnglesRight}
            color={currentPage === totalPages ? '#a4a4a4' : '#000'}
            fontSize={12}
          />
        </button>
      </div>
    </div>
  )
}
