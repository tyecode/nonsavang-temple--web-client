'use client'

import { ColumnDef } from '@tanstack/react-table'

import { Account } from '@/types/account'

import { formatDate } from '@/lib/date-format'

import { Checkbox } from '@/components/ui/checkbox'
import { toast } from '@/components/ui/use-toast'

import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<Account>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value: boolean) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'user.display_name',
    header: 'ເຈົ້າຂອງບັນຊີ',
    cell: ({ row }) => (
      <span
        className='cursor-pointer'
        onClick={() => {
          navigator.clipboard.writeText(row.original.user.id)
          toast({ description: 'ຄັດລອກໄອດີລົງໃນຄລິບບອດແລ້ວ' })
        }}
      >
        {row.original.user.display_name}
      </span>
    ),
  },
  {
    accessorKey: 'name',
    header: 'ຊື່ບັນຊີ',
  },
  {
    accessorKey: 'balance',
    header: 'ຈຳນວນເງິນ',
    cell: ({ row }) => {
      const current = row.original

      return current.currency && current.currency.symbol ? (
        <span className='whitespace-nowrap'>
          {current.balance < 0 ? '-' : ''}
          {current.currency.symbol}
          {Math.abs(current.balance).toLocaleString()}
        </span>
      ) : (
        '--'
      )
    },
  },
  {
    accessorKey: 'remark',
    header: 'ໝາຍເຫດ',
    cell: ({ row }) => {
      const current = row.original

      return current.remark ? current.remark : '--'
    },
  },
  {
    accessorKey: 'created_at',
    header: 'ສ້າງວັນທີ່',
    cell: ({ row }) => {
      const current = row.original

      return formatDate(current.created_at)
    },
  },
  {
    accessorKey: 'updated_at',
    header: 'ອັບເດດວັນທີ່',
    cell: ({ row }) => {
      const current = row.original

      return current.updated_at ? formatDate(current.updated_at) : '--'
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
