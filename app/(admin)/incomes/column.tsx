'use client'

import { ColumnDef } from '@tanstack/react-table'

import { Income } from '@/types/income'

import { Checkbox } from '@/components/ui/checkbox'
import { StatusBadge } from '@/components/badges'
import { toast } from '@/components/ui/use-toast'

import { formatDate } from '@/lib/date-format'

import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<Income>[] = [
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
    accessorKey: 'account.name',
    header: 'ຊື່ບັນຊີ',
    cell: ({ row }) => (
      <span
        className='cursor-pointer'
        onClick={() => {
          navigator.clipboard.writeText(row.original.account.id)
          toast({ description: 'ຄັດລອກໄອດີລົງໃນຄລິບບອດແລ້ວ' })
        }}
      >
        {row.original.account.name}
      </span>
    ),
  },
  {
    accessorKey: 'category.name',
    header: 'ປະເພດລາຍຮັບ',
    cell: ({ row }) => (
      <span
        className='cursor-pointer'
        onClick={() => {
          navigator.clipboard.writeText(row.original.category.id)
          toast({ description: 'ຄັດລອກໄອດີລົງໃນຄລິບບອດແລ້ວ' })
        }}
      >
        {row.original.category.name}
      </span>
    ),
  },
  {
    accessorKey: 'donator.display_name',
    header: 'ຜູ້ບໍລິຈາກ',
    cell: ({ row }) => {
      const donator = row.original.donator

      return donator ? (
        <span
          className='cursor-pointer'
          onClick={() => {
            navigator.clipboard.writeText(donator.id)
            toast({ description: 'ຄັດລອກໄອດີລົງໃນຄລິບບອດແລ້ວ' })
          }}
        >
          {donator.display_name}
        </span>
      ) : (
        '--'
      )
    },
  },
  {
    accessorKey: 'amount',
    header: 'ຈຳນວນເງິນ',
    cell: ({ row }) => {
      const current = row.original

      return current.currency && current.currency.symbol ? (
        <span className='whitespace-nowrap'>
          {current.amount < 0 ? '-' : ''}
          {current.currency.symbol}
          {Math.abs(current.amount).toLocaleString()}
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

      return current.remark || '--'
    },
  },
  {
    accessorKey: 'status',
    header: 'ສະຖານະ',
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
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
    accessorKey: 'status_dates',
    header: 'ອະນຸມັດ/ປະຕິເສດວັນທີ່',
    cell: ({ row }) => {
      const current = row.original

      return current.status_dates ? formatDate(current.status_dates) : '--'
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
