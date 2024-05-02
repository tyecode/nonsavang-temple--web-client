'use client'

import { useEffect, useState } from 'react'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'

import { Account } from '@/types/account'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/date-format'
import { getAccount } from '@/actions/account-actions'
import { useAccountStore } from '@/stores'
import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandItem } from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export function AccountSelector({
  onStateChange,
}: {
  onStateChange?: (state: { id: string; balance: number }) => void
}) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<string>('')

  const accounts = useAccountStore((state) => state.accounts)
  const setAccounts = useAccountStore((state) => state.setAccounts)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAccount()

        if (res.error || !res.data) return

        const newAccounts: Account[] = res.data.map((account: Account) => ({
          ...account,
          created_at: formatDate(account.created_at),
          updated_at: account.updated_at
            ? formatDate(account.updated_at)
            : undefined,
        }))

        setAccounts(newAccounts as Account[])
      } catch (error) {
        console.error('Error fetching accounts: ', error)
      }
    }
    fetchData()
  }, [setAccounts])

  useEffect(() => {
    if (accounts.length > 0) {
      setValue(accounts[0].id)
    }
  }, [accounts])

  useEffect(() => {
    if (onStateChange) {
      const selectedAccount = accounts.find((account) => account.id === value)
      if (selectedAccount) {
        onStateChange({
          id: selectedAccount.id,
          balance: selectedAccount.balance,
        })
      } else {
        onStateChange({ id: '', balance: 0 })
      }
    }
  }, [accounts, onStateChange, value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-[260px] justify-between'
        >
          {value
            ? accounts.find((account) => account.id === value)?.name
            : 'ເລືອກບັນຊີ...'}
          <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[260px] p-0'>
        <Command>
          <CommandGroup>
            {accounts.map((account) => (
              <CommandItem
                key={account.id}
                value={account.id}
                onSelect={(currentValue: string) => {
                  setValue(currentValue)
                  setOpen(false)
                }}
              >
                {account.name}
                <CheckIcon
                  className={cn(
                    'ml-auto h-4 w-4',
                    value === account.id ? 'opacity-100' : 'opacity-0'
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
