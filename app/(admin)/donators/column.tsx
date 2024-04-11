'use client'

import { ColumnDef } from '@tanstack/react-table'

import { Donator } from '@/types'

import { formatDate } from '@/lib/date-format'

import { Checkbox } from '@/components/ui/checkbox'

import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<Donator>[] = [
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
    accessorKey: 'display_name',
    header: 'ຊື່ ແລະ ນາມສະກຸນ',
  },
  {
    accessorKey: 'village',
    header: 'ບ້ານ',
    cell: ({ row }) => {
      const current = row.original

      return current.village ? current.village : '--'
    },
  },
  {
    accessorKey: 'district',
    header: 'ເມືອງ',
    cell: ({ row }) => {
      const current = row.original

      return current.district ? current.district : '--'
    },
  },
  {
    accessorKey: 'province',
    header: 'ແຂວງ',
    cell: ({ row }) => {
      const current = row.original

      return current.province ? current.province : '--'
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
