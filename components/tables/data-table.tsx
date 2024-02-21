'use client'

import { useEffect, useState } from 'react'

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import AddUserModal from '@/components/modals/add-user-modal'
import { Button } from '@/components/ui/button'
import { DataTablePagination } from '@/components/tables/data-table-pagination'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { usePendingStore } from '@/stores/usePendingStore'
import { ScrollArea } from '../ui/scroll-area'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<string>('')
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [selectedItems, setSelectedItems] = useState<TData[]>([])
  const isPending = usePendingStore((state) => state.isPending)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    // onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      // pagination: {
      //   pageSize: 6,
      // },
    },
    state: {
      sorting,
      // columnFilters,
      globalFilter: columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  useEffect(() => {
    const selectedItems = table
      .getRowModel()
      .rows.filter((row) => row.getIsSelected())
      .map((row) => row.original)

    setSelectedItems(selectedItems)
  }, [table, rowSelection])

  return (
    <div>
      <div className='flex w-full justify-between py-4'>
        <div className='flex gap-4'>
          <Input
            placeholder='ຄົ້ນຫາ...'
            value={columnFilters}
            onChange={(event) => setColumnFilters(event.target.value)}
            className='w-80'
          />
          {selectedItems.length > 0 && (
            <Button
              variant='default'
              size={'sm'}
              onClick={() => console.log(selectedItems)}
            >
              {`ລຶບ ${selectedItems.length} ລາຍການ`}
            </Button>
          )}
        </div>

        <div className='flex gap-4'>
          <AddUserModal />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size={'sm'} className='ml-auto'>
                ເລືອກສະແດງຖັນ
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  if (column.id === 'id') return null

                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className='capitalize'
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <ScrollArea
        className={
          table.getRowModel().rows?.length > 6
            ? 'h-[64vh] rounded-md border'
            : 'max-h-[64vh] rounded-md border'
        }
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  if (header.id === 'id') return null

                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => {
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => {
                      if (cell.id.split('_')[1] === 'id') return null

                      return (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })
            ) : isPending ? (
              <>
                {[...Array(5)].map((array, index) => (
                  <TableRow key={index}>
                    <TableCell></TableCell>
                    <TableCell className='py-4'>
                      <Skeleton className='h-5 w-full' />
                    </TableCell>
                    <TableCell className='py-4'>
                      <Skeleton className='h-5 w-full' />
                    </TableCell>
                    <TableCell className='py-4'>
                      <Skeleton className='h-5 w-full' />
                    </TableCell>
                    <TableCell className='py-4'>
                      <Skeleton className='h-5 w-full' />
                    </TableCell>
                    <TableCell className='py-4'>
                      <Skeleton className='h-5 w-full' />
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                ))}
              </>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  ບໍ່ມີຂໍ້ມູນ
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
      <div className='mt-6'>
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}
