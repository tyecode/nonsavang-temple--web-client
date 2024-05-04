'use client'

import { ColumnDef } from '@tanstack/react-table'

import { Transaction } from '@/types'
import { formatDate } from '@/lib/date-format'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from '@/components/ui/use-toast'
import { TypeBadge } from '@/components/badges'

import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<Transaction>[] = [
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
    accessorKey: 'transaction_type',
    header: 'ປະເພດລາຍການ',
    cell: ({ row }) => (
      <TypeBadge status={row.original.transaction_type.toUpperCase()} />
    ),
  },
  {
    accessorKey: 'category.name',
    header: 'ປະເພດລາຍຮັບ/ລາຍຈ່າຍ',
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
    accessorKey: 'participant.display_name',
    header: 'ຜູ້ບໍລິຈາກ/ຜູ້ເບີກຈ່າຍ',
    cell: ({ row }) => {
      const current = row.original

      return current.participant?.display_name ? (
        <span
          className='cursor-pointer'
          onClick={() => {
            if (current.participant) {
              navigator.clipboard.writeText(current.participant.id)
              toast({ description: 'ຄັດລອກໄອດີລົງໃນຄລິບບອດແລ້ວ' })
            }
          }}
        >
          {current.participant.display_name}
        </span>
      ) : (
        <>--</>
      )
    },
  },
  {
    accessorKey: 'amount',
    header: 'ຈຳນວນເງິນ',
    cell: ({ row }) => {
      const current = row.original

      return (
        <span>
          {current.amount < 0 ? '-' : ''}
          {current.currency.symbol}
          {Math.abs(current.amount).toLocaleString()}
        </span>
      )
    },
  },
  {
    accessorKey: 'remark',
    header: 'ໝາຍເຫດ',
    cell: ({ row }) => {
      const current = row.original

      return current.remark ? (
        <span className='text-sm'>{current.remark}</span>
      ) : (
        <span className='text-sm'>--</span>
      )
    },
  },
  {
    accessorKey: 'created_at',
    header: 'ສ້າງວັນທີ່',
    cell: ({ row }) => {
      const current = row.original

      return <span>{formatDate(current.created_at)}</span>
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
