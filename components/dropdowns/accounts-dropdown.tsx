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
// import { deleteUsers } from '@/actions/user-actions'
import { useAccountStore } from '@/stores/useAccountStore'
import { User } from '@/types/user'

type Props = {
  user: User
}

export const AccountsDropdown = (props: any) => {
  const getAccounts = useAccountStore((state) => state.accounts)
  const setAccounts = useAccountStore((state) => state.setAccounts)
  const { toast } = useToast()

  const handleDeleteAccount = async () => {
    let newAccounts: any[] = []

    getAccounts.map((account: any) => {
      if (account.id !== props.account.id) {
        newAccounts.push(account)
      }
    })

    setAccounts(newAccounts)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='flex-center aspect-square w-7 cursor-pointer rounded-md outline-none hover:bg-accent'>
        <DotsVerticalIcon width={28} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='mx-6'>
        <DropdownMenuGroup>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={handleDeleteAccount}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
