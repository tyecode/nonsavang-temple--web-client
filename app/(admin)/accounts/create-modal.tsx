'use client'

import { useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'

import { Account } from '@/types/account'
import { Currency } from '@/types/currency'

import { createAccount } from '@/actions/account-actions'
import { getSession } from '@/actions/auth-actions'

import { useAccountStore } from '@/stores'

import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { LoadingButton } from '@/components/buttons'
import MonetaryInput from '@/components/monetary-input'
import { Command, CommandGroup, CommandItem } from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { toast } from '@/components/ui/use-toast'

import { accountSchema } from './schema'

const fetchCurrency = async () => {
  const res = await fetch('/currencies/api', {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
    cache: 'no-store',
    next: {
      revalidate: 0,
    },
  })

  if (!res.ok) return

  return await res.json()
}

export const AccountCreateModal = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [openCurrency, setOpenCurrency] = useState(false)

  const accounts = useAccountStore((state) => state.accounts)
  const setAccounts = useAccountStore((state) => state.setAccounts)

  const form = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: '',
      balance: '0',
      currency: '',
      remark: '',
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchCurrency()

      const sortedData = res.data.sort(
        (a: { code: string }, b: { code: string }) =>
          a.code.localeCompare(b.code)
      )

      setCurrencies(sortedData)
      form.setValue('currency', sortedData[0].id)
    }

    fetchData()
  }, [form])

  const createNewAccount = async (
    values: z.infer<typeof accountSchema>,
    currency: { id: string; code: string; name: string },
    userId: string
  ) => {
    try {
      const accountData = {
        name: values.name,
        balance: Number(values.balance),
        currency_id: currency.id,
        remark: values.remark,
        user_id: userId,
      }

      const res = await createAccount(accountData)

      if (res.error || !res.data) {
        toast({
          variant: 'destructive',
          description: 'ມີຂໍ້ຜິດພາດ! ເພີ່ມຂໍ້ມູນບັນຊີບໍ່ສຳເລັດ.',
        })
        return
      }

      const newAccounts: Account[] = [...accounts, ...res.data]

      setAccounts(newAccounts as Account[])
      toast({
        description: 'ເພີ່ມຂໍ້ມູນບັນຊີສຳເລັດແລ້ວ.',
      })
    } catch (error) {
      console.error('Error creating account: ', error)
    } finally {
      setIsOpen(false)
      form.reset()
    }
  }

  const onSubmit = async (values: z.infer<typeof accountSchema>) => {
    const session = await getSession()

    if (!session || currencies.length === 0) return

    const userId = session.user.id

    const selectedCurrency = currencies.find(
      (currency) => currency.id === values.currency
    )

    if (!selectedCurrency) return

    startTransition(() => createNewAccount(values, selectedCurrency, userId))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {!isPending ? (
          <Button size={'sm'}>ເພິ່ມຂໍ້ມູນ</Button>
        ) : (
          <LoadingButton>ເພິ່ມຂໍ້ມູນ</LoadingButton>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>ເພີ່ມຂໍ້ມູນບັນຊີ</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='grid gap-4 py-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel className='pointer-events-none'>
                    ຊື່ບັນຊີ
                  </FormLabel>
                  <FormControl>
                    <Input disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='balance'
                render={({ field: { value, onChange, ...rest } }) => (
                  <FormItem className='w-full'>
                    <FormLabel className='pointer-events-none'>
                      ຈຳນວນເງິນຕັ້ງຕົ້ນ
                    </FormLabel>
                    <FormControl>
                      <MonetaryInput
                        value={value}
                        isPending={isPending}
                        onChange={(e: any) => onChange(e)}
                        {...rest}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='currency'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel className='pointer-events-none my-[5px]'>
                      ສະກຸນເງິນ
                    </FormLabel>
                    <Popover open={openCurrency} onOpenChange={setOpenCurrency}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            disabled={isPending}
                            variant='outline'
                            role='combobox'
                            aria-expanded={openCurrency}
                            className='w-full justify-between'
                          >
                            {field.value && currencies.length > 0
                              ? currencies.find(
                                  (currency: Currency) =>
                                    currency.id === field.value
                                )?.name +
                                ` (${currencies.find((currency: Currency) => currency.id === field.value)?.symbol})`
                              : 'ເລືອກສະກຸນເງິນ...'}
                            <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <FormMessage />
                      <PopoverContent className='w-[180px] p-0'>
                        <Command>
                          <CommandGroup className='max-h-[200px] overflow-y-scroll'>
                            {currencies.map((currency: Currency) => (
                              <CommandItem
                                key={currency.id}
                                value={currency.id}
                                onSelect={() => {
                                  field.onChange(currency.id)
                                  setOpenCurrency(false)
                                }}
                              >
                                {`${currency.name} (${currency.symbol})`}
                                <CheckIcon
                                  className={cn(
                                    'ml-auto h-4 w-4',
                                    field.value === currency.id
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='remark'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='pointer-events-none'>ໝາຍເຫດ</FormLabel>
                  <Textarea
                    disabled={isPending}
                    className='col-span-3'
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex w-full justify-end'>
              {!isPending ? (
                <Button type='submit' size={'sm'} className='w-fit'>
                  ເພິ່ມຂໍ້ມູນ
                </Button>
              ) : (
                <LoadingButton>ເພິ່ມຂໍ້ມູນ</LoadingButton>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
