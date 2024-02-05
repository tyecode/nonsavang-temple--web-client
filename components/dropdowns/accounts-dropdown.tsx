'use client'

import { Users } from '@prisma/client'
import { DotsVerticalIcon } from '@radix-ui/react-icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'
import { deleteUsers } from '@/actions/users-actions'
import { useAccountsStore } from '@/stores/useAccountsStore'

type Props = {
  user: Users
}

export const AccountsDropdown = (props: any) => {
  const getAccounts = useAccountsStore((state) => state.accounts)
  const updateAccounts = useAccountsStore((state) => state.updateAccounts)
  const { toast } = useToast()

  const handleDeleteAccount = async () => {
    let newAccounts: any[] = []

    getAccounts.map((account: any) => {
      if (account.id !== props.account.id) {
        newAccounts.push(account)
      }
    })

    updateAccounts(newAccounts)
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
