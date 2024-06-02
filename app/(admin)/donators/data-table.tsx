'use client'

import { useEffect, useState, useTransition } from 'react'
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { Donator } from '@/types/donator'
import { User } from '@/types/user'

import { deleteDonator } from '@/actions/donator-actions'

import { useDonatorStore } from '@/stores'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { DataTablePagination } from '@/components/data-table-pagination'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { LoadingButton } from '@/components/buttons'
import DataTableSkeleton from '@/components/data-table-skeleton'

import { DonatorCreateModal } from './create-modal'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isPending: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isPending,
}: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [globalFilter, setGlobalFilters] = useState<string>('')
  const [isLoading, startTransition] = useTransition()
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [rowSelection, setRowSelection] = useState({})
  const [selectedItems, setSelectedItems] = useState<TData[]>([])
  const [sorting, setSorting] = useState<SortingState>([])

  const setDonators = useDonatorStore((state) => state.setDonators)
  const donators = useDonatorStore((state) => state.donators)

  const { toast } = useToast()

  const table = useReactTable({
    data,
    columns,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      globalFilter,
      columnVisibility,
      rowSelection,
      pagination,
    },
  })

  useEffect(() => {
    const selectedItems: TData[] = table
      .getRowModel()
      .rows.filter((row) => row.getIsSelected())
      .map((row) => row.original)

    setSelectedItems(selectedItems)
  }, [table, rowSelection])

  useEffect(() => {
    table.toggleAllPageRowsSelected(false)
  }, [table, pagination])

  const handleDeleteSelected = async (items: User[]) => {
    startTransition(async () => {
      try {
        const res = await Promise.all(
          items.map((item) => deleteDonator(item.id))
        )
        const hasError = res.some((r) => r.error)

        if (hasError) {
          toast({
            variant: 'destructive',
            description: 'ມີຂໍ້ຜິດພາດ! ບໍ່ສາມາດລຶບຂໍ້ມູນທີ່ເລືອກໄດ້.',
          })
          return
        }

        const newDonators = donators.filter(
          (donator: Donator) =>
            !items.map((item) => item.id).includes(donator.id)
        )

        setDonators(newDonators as Donator[])
        toast({
          description: `ລຶບຂໍ້ມູນທີ່ເລືອກທັງຫມົດແລ້ວ.`,
        })
      } catch (error) {
        console.error('Error deleting selected donators: ', error)
      }
    })
  }

  return (
    <div className='space-y-4'>
      <div className='flex w-full justify-between'>
        <div className='flex gap-4'>
          <Input
            placeholder='ຄົ້ນຫາ...'
            value={globalFilter}
            onChange={(event) => setGlobalFilters(event.target.value)}
            className='w-80'
          />
          {selectedItems.length > 0 && (
            <>
              {!isLoading ? (
                <Button
                  variant='default'
                  size={'sm'}
                  onClick={() => handleDeleteSelected(selectedItems as User[])}
                >
                  {`ລຶບ ${selectedItems.length} ລາຍການ`}
                </Button>
              ) : (
                <LoadingButton>{`ລຶບ ${selectedItems.length} ລາຍການ`}</LoadingButton>
              )}
            </>
          )}
        </div>

        <div className='flex gap-4'>
          <DonatorCreateModal />
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
      <div className='rounded-md border'>
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
              <DataTableSkeleton columns={columns.length} />
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
      </div>
      <div className='mt-6'>
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}
