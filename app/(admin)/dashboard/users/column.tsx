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
import { useUserStore } from '@/stores/useUserStore'
import { useToast } from '@/components/ui/use-toast'
import { User } from '@/types/user'
import { deleteUser } from '@/actions/user-actions'
import CreateAvatar from '@/lib/create-avatar'

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
        <div className='min-w-10'>
          <CreateAvatar seed={row.original.display_name || ''} />
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
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const current = row.original

      const users: User[] = useUserStore((state) => state.users)
      const updateUsers = useUserStore((state) => state.updateUsers)
      const { toast } = useToast()

      const handleDeleteUser = async (id: string) => {
        try {
          const res = await deleteUser(id)

          if (res.error) {
            throw new Error(res.message)
          }

          const newUsers = users.filter((user) => user.id !== id)

          updateUsers(newUsers)

          toast({
            description: 'Delete select user successful.',
          })
        } catch (error) {
          toast({
            description: 'Failed to delete the selected user.',
          })
        }
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
              ຄັດລອກໄອດີ
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>ແກ້ໄຂຂໍ້ມູນ</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDeleteUser(current.id)}
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
