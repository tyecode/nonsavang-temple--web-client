'use client'

import { useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'

import { Account } from '@/types/account'
import { Currency } from '@/types/currency'

import { createAccount, getAccount } from '@/actions/account-actions'
import { getCurrency } from '@/actions/currency-actions'
import { getSession } from '@/actions/auth-actions'

import { useAccountStore } from '@/stores'
import { AccountState } from '@/stores/useAccountStore'

import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/date-format'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingButton } from '@/components/buttons'
import { Textarea } from '@/components/ui/textarea'
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

const formSchema: any = z.object({
  name: z.string().min(1, 'ກະລຸນາປ້ອນຊື່ບັນຊີ.'),
  balance: z
    .string()
    .min(1, 'ກະລຸນາປ້ອນຈຳນວນເງິນ.')
    .regex(/^[-]?\d+$/, {
      message: 'ຈຳນວນເງິນຕ້ອງເປັນຕົວເລກເທົ່ານັ້ນ.',
    })
    .refine((value) => Number(value) >= 0, {
      message: 'ປ້ອນຈຳນວນເງິນບໍ່ຖືກຕ້ອງ.',
    }),
  currency: z.string().min(1, 'ກະລຸນາເລືອກສະກຸນເງິນ.'),
  remark: z.string(),
})

const AccountCreateModal = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [openCurrency, setOpenCurrency] = useState(false)

  const setAccounts = useAccountStore(
    (state: AccountState) => state.setAccounts
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      balance: '0',
      currency: '',
      remark: '',
    },
  })

  useEffect(() => {
    const getCurrencyData = async () => {
      if (currencies.length > 0) return

      try {
        const res = await getCurrency()

        if (res.error || !res.data) return

        const sortedData = res.data.sort(
          (a: { code: string }, b: { code: string }) =>
            a.code.localeCompare(b.code)
        )
        setCurrencies(sortedData)
        form.setValue('currency', sortedData[0].id)
      } catch (error) {
        console.error('Error fetching currency:', error)
      }
    }

    getCurrencyData()
  }, [currencies.length, form])

  const createNewAccount = async (
    values: z.infer<typeof formSchema>,
    user: { id: string; first_name: string; last_name: string },
    currency: { id: string; code: string; name: string }
  ) => {
    try {
      const accountData = {
        name: values.name,
        balance: Number(values.balance),
        currency_id: currency.id,
        remark: values.remark,
        user_id: user.id,
      }

      const res = await createAccount(accountData)

      if (res.error || !res.data) {
        toast({
          variant: 'destructive',
          description: 'ມີຂໍ້ຜິດພາດ! ເພີ່ມຂໍ້ມູນບັນຊີບໍ່ສຳເລັດ.',
        })
        return
      }

      const accounts = await getAccount()

      if (accounts.error || !accounts.data) return

      const newAccounts: Account[] = accounts.data.map((account: Account) => ({
        ...account,
        created_at: formatDate(account.created_at),
        updated_at: account.updated_at
          ? formatDate(account.updated_at)
          : undefined,
      }))

      setAccounts(newAccounts)
      toast({
        description: 'ເພີ່ມຂໍ້ມູນບັນຊີສຳເລັດແລ້ວ.',
      })
    } catch (error) {
      console.error('Error creating donator:', error)
    } finally {
      setIsOpen(false)
      form.reset()
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const session = await getSession()

    if (!session || currencies.length === 0) return

    startTransition(
      async () =>
        await createNewAccount(
          values,
          {
            id: session.user.id,
            first_name: session.user.user_metadata.first_name,
            last_name: session.user.user_metadata.last_name,
          },
          currencies.find((currency) => currency.id === values.currency)!
        )
    )
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
                render={({ field: { onChange, ...rest } }) => (
                  <FormItem className='w-full'>
                    <FormLabel className='pointer-events-none'>
                      ຈຳນວນເງິນຕັ້ງຕົ້ນ
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        onChange={(event: any) => {
                          const value = event.target.value
                          const data = event.nativeEvent.data

                          if (isNaN(Number(data))) return

                          if (value.startsWith('0')) {
                            if (data === '0') {
                              onChange(0)
                            } else {
                              onChange(value.slice(1))
                            }
                          } else {
                            onChange(value)
                          }
                        }}
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
                            {field.value
                              ? currencies.find(
                                  (currency: Currency) =>
                                    currency.id === field.value
                                )?.name
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
                                {currency.name}
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

export default AccountCreateModal
