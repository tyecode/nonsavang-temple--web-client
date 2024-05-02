'use client'

import Link from 'next/link'
import { ColumnDef } from '@tanstack/react-table'

import { Expense } from '@/types/expense'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from '@/components/ui/use-toast'

import { formatDate } from '@/lib/date-format'

import { DataTableRowActions } from './data-table-row-actions'
import { StatusBadge } from '@/components/badges'

export const columns: ColumnDef<Expense>[] = [
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
    header: 'ປະເພດລາຍຈ່າຍ',
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
    accessorKey: 'drawer.display_name',
    header: 'ຜູ້ເບີກຈ່າຍ',
    cell: ({ row }) => {
      const drawer = row.original.drawer

      return drawer ? (
        <span
          className='cursor-pointer'
          onClick={() => {
            navigator.clipboard.writeText(drawer.id)
            toast({ description: 'ຄັດລອກໄອດີລົງໃນຄລິບບອດແລ້ວ' })
          }}
        >
          {drawer.display_name}
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
    accessorKey: 'image',
    header: 'ຮູບພາບ',
    cell: ({ row }) => {
      const image = row.original.image

      return image ? (
        <Button size={'sm'} variant={'link'} className='m-0 p-0'>
          <Link href={image} target='_blank'>
            ເບິ່ງຮູບພາບ
          </Link>
        </Button>
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
