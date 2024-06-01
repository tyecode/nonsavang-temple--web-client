'use client'

import { useEffect, useState } from 'react'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'

import { Account } from '@/types/account'
import { cn } from '@/lib/utils'
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
  onStateChange?: (state: {
    id: string
    balance: number
    currency: string
  }) => void
}) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<string>('')
  const [accounts, setAccounts] = useState<Account[]>([])

  useEffect(() => {
    const fetchAccounts = async () => {
      const res = await fetch('/accounts/api', {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
        },
        cache: 'no-cache',
        next: {
          revalidate: false,
        },
      })

      if (!res.ok) return

      const accounts = await res.json()

      setAccounts(accounts?.data)
      setValue(accounts?.data[0]?.id)
    }

    fetchAccounts()
  }, [])

  useEffect(() => {
    if (onStateChange) {
      const selectedAccount = accounts?.find((account) => account?.id === value)

      if (selectedAccount) {
        onStateChange({
          id: selectedAccount.id,
          balance: selectedAccount.balance,
          currency: selectedAccount.currency.symbol,
        })
      } else {
        onStateChange({ id: '', balance: 0, currency: '#' })
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
            ? accounts?.find((account) => account?.id === value)?.name
            : 'ເລືອກບັນຊີ...'}
          <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[260px] p-0'>
        <Command>
          <CommandGroup>
            {accounts.length > 0 &&
              accounts?.map((account) => (
                <CommandItem
                  key={account.id}
                  value={account.id}
                  onSelect={(currentValue: string) => {
                    setValue(currentValue)
                    setOpen(false)
                  }}
                >
                  {account?.name}
                  <CheckIcon
                    className={cn(
                      'ml-auto h-4 w-4',
                      value === account?.id ? 'opacity-100' : 'opacity-0'
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
