'use client'

import { ColumnDef } from '@tanstack/react-table'

import { User } from '@/types/user'

import { formatDate } from '@/lib/date-format'
import { CreateAvatar } from '@/lib/create-avatar'

import { Checkbox } from '@/components/ui/checkbox'

import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<User>[] = [
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
    cell: ({ row }) => (
      <div className='flex items-center gap-4'>
        <div className='relative min-w-10'>
          <CreateAvatar
            src={row.original.image}
            seed={row.original.display_name || ''}
          />
        </div>
        {row.original.display_name}
      </div>
    ),
  },
  {
    accessorKey: 'email',
    header: 'ອີເມວ',
  },
  {
    accessorKey: 'role',
    header: 'ສິດຜູ້ໃຊ້',
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
