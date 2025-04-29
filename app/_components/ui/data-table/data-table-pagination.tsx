import { Table } from '@tanstack/react-table'
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react'

import { Button } from '../button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  meta?: {
    [key: string]: number
  }
}

export function DataTablePagination<TData>({
  table,
  meta,
}: DataTablePaginationProps<TData>) {
  const pagination = table.options.state?.pagination
  const pageIndex = pagination?.pageIndex ?? 0
  const pageSize = pagination?.pageSize ?? 0
  const firstItemOnPage = pageIndex * pageSize + 1
  const lastItemOnPage = Math.min(
    (pageIndex + 1) * pageSize,
    table.options.rowCount ?? 0,
  )

  return (
    <div className="flex items-center justify-end px-2 py-4">
      <div className="flex items-center space-x-4 text-text">
        <div className="flex items-center space-x-0.5">
          <p className="text-sm font-medium">Itens por página</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px] border-0 bg-transparent">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent>
              {[10, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-center text-sm font-medium">
          {firstItemOnPage} - {lastItemOnPage} de {table.options.rowCount ?? 0}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            className="text-brand-tertiary flex h-5 w-5 bg-transparent p-0 hover:bg-white disabled:bg-transparent disabled:text-text"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronFirst className="h-5 w-5" />
          </Button>
          <Button
            className="text-brand-tertiary flex h-5 w-5 bg-transparent p-0 hover:bg-white disabled:bg-transparent disabled:text-text"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </Button>
          <Button
            className="text-brand-tertiary flex h-5 w-5 bg-transparent p-0 hover:bg-white disabled:bg-transparent disabled:text-text"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon className="h-5 w-5" />
          </Button>
          <Button
            className="text-brand-tertiary flex h-5 w-5 bg-transparent p-0 hover:bg-white disabled:bg-transparent disabled:text-text"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronLast className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
