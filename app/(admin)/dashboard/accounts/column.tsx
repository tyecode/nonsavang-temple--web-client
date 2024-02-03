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
import { Accounts } from '@prisma/client'
import { useUsersStore } from '@/stores/useUsersStore'
import { useToast } from '@/components/ui/use-toast'
import { deleteUsers } from '@/actions/users-actions'

export const columns: ColumnDef<Accounts>[] = [
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
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'balance',
    header: 'Balance',
  },
  {
    accessorKey: 'currency',
    header: 'Currency',
  },
  {
    accessorKey: 'remark',
    header: 'Remark',
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const current = row.original

      const users: UsersInterface[] = useUsersStore((state) => state.users)
      const updateUsers = useUsersStore((state) => state.updateUsers)
      const { toast } = useToast()

      const handleDeleteUser = async (props: UsersInterface) => {
        let newUsers: UsersInterface[] = []

        await deleteUsers(props.id).then((res) => {
          if (res.error)
            return toast({
              description: res.message,
            })

          users.forEach((user) => {
            if (user.id !== props.id) {
              newUsers = [...newUsers, user]
            }
          })

          updateUsers(newUsers)

          return toast({
            description: 'Delete select user successful',
          })
        })
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
              // onClick={() => handleDeleteUser(current)}
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
