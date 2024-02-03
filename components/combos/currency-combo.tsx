'use client'

import * as React from 'react'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useCurrencyStore } from '@/stores/useCurrencyStore'

const frameworks = [
  {
    value: 'lak',
    label: 'LAK',
  },
  {
    value: 'thb',
    label: 'THB',
  },
  {
    value: 'usd',
    label: 'USD',
  },
]

export function CurrencyCombo() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('lak')
  const setCurrency = useCurrencyStore((state) => state.updateCurrency)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-[277px] justify-between'
          size={'sm'}
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : 'Select currency...'}
          <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[277px] p-0'>
        <Command>
          <CommandInput placeholder='Search framework...' className='h-9' />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            {frameworks.map((framework) => (
              <CommandItem
                key={framework.value}
                value={framework.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? currentValue : currentValue)
                  setOpen(false)
                  setCurrency(currentValue)
                }}
              >
                {framework.label}
                <CheckIcon
                  className={cn(
                    'ml-auto h-4 w-4',
                    value === framework.value ? 'opacity-100' : 'opacity-0'
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
