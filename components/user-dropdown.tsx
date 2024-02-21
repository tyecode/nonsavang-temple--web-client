'use client'

import { DotsVerticalIcon } from '@radix-ui/react-icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'
import { deleteUser } from '@/actions/user-actions'
import { useUsersStore } from '@/stores/useUsersStore'
import { User } from '@/types/user'

type Props = {
  user: User
}

export const UserDropdown = (props: Props) => {
  const users: User[] = useUsersStore((state) => state.users)
  const updateUsers = useUsersStore((state) => state.updateUsers)
  const { toast } = useToast()

  const handleDeleteUser = async () => {
    let newUsers: User[] = []

    await deleteUser(props.user.id).then((res) => {
      if (!res)
        return toast({
          description: 'Could not delete select user',
        })

      users.forEach((user) => {
        if (user.id !== props.user.id) {
          newUsers.push(user)
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
      <DropdownMenuTrigger className='flex-center aspect-square w-7 cursor-pointer rounded-md outline-none hover:bg-accent'>
        <DotsVerticalIcon width={28} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='mx-6'>
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem onClick={handleDeleteUser}>
            Delete user
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
