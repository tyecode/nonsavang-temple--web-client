/* eslint-disable react-hooks/rules-of-hooks */
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

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Category = {
  id: string
  name: string
  description: string
}

export const columns: ColumnDef<Category>[] = [
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
    accessorKey: 'description',
    header: 'ຄຳອະທິບາຍ',
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const current = row.original
      const category = useIncomesCategoryStore((state) => state.category)
      const updateCategory = useIncomesCategoryStore(
        (state) => state.updateCategory
      )

      const handleDelete = (id: string) => {
        let newCategory: any[] = []

        category.map((category) => {
          if (category.id !== current.id) {
            newCategory = [...newCategory, category]
          }
        })

        updateCategory(newCategory)
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
