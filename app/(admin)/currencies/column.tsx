'use client'

import { ColumnDef } from '@tanstack/react-table'

import { Currency } from '@/types/currency'

import { Checkbox } from '@/components/ui/checkbox'
import { DataTableRowActions } from './data-table-row-actions'
import { formatDate } from '@/lib/date-format'

export const columns: ColumnDef<Currency>[] = [
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
    accessorKey: 'code',
    header: 'ລະຫັດ',
  },
  {
    accessorKey: 'name',
    header: 'ຊື່ສະກຸນເງິນ',
  },
  {
    accessorKey: 'symbol',
    header: 'ສັນຍາລັກ',
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
