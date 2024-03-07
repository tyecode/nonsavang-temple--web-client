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

import { User } from '@/types/user'

import { deleteUser, getUser } from '@/actions/user-actions'

import { usePendingStore } from '@/stores/usePendingStore'
import { useUserStore } from '@/stores/useUserStore'

import { Button } from '@/components/ui/button'
import { DataTablePagination } from '@/components/data-table-pagination'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'
import LoadingButton from '@/components/buttons/loading-button'
import DataTableSkeleton from '@/components/data-table-skeleton'
import { UserCreateModal } from '@/components/modals/user'
import { formatDate } from '@/lib/date-format'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilters] = useState<string>('')
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [selectedItems, setSelectedItems] = useState<TData[]>([])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const isPending = usePendingStore((state) => state.isPending)
  const setUsers = useUserStore((state) => state.setUsers)
  const { toast } = useToast()
  const [isLoading, startTransition] = useTransition()

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
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
        const res = await Promise.all(items.map((item) => deleteUser(item.id)))
        const hasError = res.some((r) => r.error)

        if (hasError) {
          toast({
            variant: 'destructive',
            description: 'ມີຂໍ້ຜິດພາດ! ບໍ່ສາມາດລຶບຂໍ້ມູນທີ່ເລືອກໄດ້.',
          })
          return
        }

        const users = await getUser()

        if (users.error || !users.data) return

        const newUsers = users.data.map((item: User) => ({
          ...item,
          created_at: formatDate(item.created_at),
          updated_at: item.updated_at ? formatDate(item.updated_at) : undefined,
        }))

        setUsers(newUsers)
        toast({
          description: `ລຶບຂໍ້ມູນທີ່ເລືອກທັງຫມົດແລ້ວ.`,
        })
      } catch (error) {
        console.error('Error deleting selected users:', error)
      }
    })
  }

  return (
    <div>
      <div className='flex w-full justify-between py-4'>
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
          <UserCreateModal />
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
      </ScrollArea>
      <div className='mt-6'>
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}
