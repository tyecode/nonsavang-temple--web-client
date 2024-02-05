'use client'

import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useIncomesCategoryStore } from '@/stores/useIncomesCategoryStore'
import { IncomesCategory } from '@prisma/client'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<IncomesCategory>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: 'ລະຫັດ',
  },
  {
    accessorKey: 'name',
    header: 'ຊື່ປະເພດລາຍຮັບ',
  },
  {
    accessorKey: 'remark',
    header: 'ຄຳອະທິບາຍ',
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const current = row.original
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const categories = useIncomesCategoryStore((state) => state.category)
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const updateCategories = useIncomesCategoryStore(
        (state) => state.updateCategory
      )

      const handleDelete = (id: string) => {
        let newCategories: any[] = []

        categories.map((category) => {
          if (category.id !== current.id) {
            newCategories = [...newCategories, category]
          }
        })

        updateCategories(newCategories)
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='float-right h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <DotsHorizontalIcon className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(current.id)}
            >
              ຄັດລອກລະຫັດ
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>ແກ້ໄຂຂໍ້ມູນ</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(current.id)}
              className='text-danger transition-none focus:text-danger'
            >
              ລົບຂໍ້ມູນ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
