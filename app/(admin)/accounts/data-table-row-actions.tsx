'use client'

import { useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Row } from '@tanstack/react-table'
import {
  CaretSortIcon,
  CheckIcon,
  DotsHorizontalIcon,
} from '@radix-ui/react-icons'

import { Account } from '@/types/account'
import { Currency } from '@/types/currency'

import { deleteAccount, updateAccount } from '@/actions/account-actions'
import { getCurrency } from '@/actions/currency-actions'

import { useAccountStore } from '@/stores'

import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandItem } from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { LoadingButton } from '@/components/buttons'
import { accountSchema } from './schema'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData extends Account>({
  row,
}: DataTableRowActionsProps<TData>) {
  const current: Account = row.original

  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)
  const [openCurrency, setOpenCurrency] = useState(false)

  const accounts = useAccountStore((state) => state.accounts)
  const setAccounts = useAccountStore((state) => state.setAccounts)

  const { toast } = useToast()

  const form: any = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
  })

  useEffect(() => {
    form.reset({
      name: current.name,
      balance: current.balance.toString(),
      currency: current.currency.id,
      remark: current.remark ? current.remark : '',
    })
  }, [current, form])

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
      } catch (error) {
        console.error('Error fetching currency: ', error)
      }
    }

    getCurrencyData()
  }, [currencies.length, form])

  const onSubmit = (values: z.infer<typeof accountSchema>) => {
    startTransition(async () => {
      try {
        const accountData = {
          name: values.name,
          balance: current.balance,
          currency_id: current.currency.id,
          remark: values.remark,
          updated_at: new Date(),
        }

        const res = await updateAccount(current.id, accountData)

        if (res.error || !res.data) {
          toast({
            variant: 'destructive',
            description: 'ມີຂໍ້ຜິດພາດ! ບໍ່ສາມາດແກ້ໄຂຂໍ້ມູນບັນຊີໄດ້.',
          })
          return
        }

        const newAccounts = accounts.map((account: Account) => {
          const updatedAccount: any = res.data?.find(
            (item) => item.id === account.id
          )

          if (updatedAccount) return updatedAccount

          return account
        })

        setAccounts(newAccounts as Account[])
        toast({
          description: 'ແກ້ໄຂຂໍ້ມູນບັນຊີສຳເລັດແລ້ວ.',
        })
      } catch (error) {
        console.error('Error updating account: ', error)
      } finally {
        setIsOpen(false)
      }
    })
  }

  const handleDeleteAccount = async (id: string) => {
    try {
      const res = await deleteAccount(id)

      if (res.error) {
        toast({
          variant: 'destructive',
          description: 'ມີຂໍ້ຜິດພາດ! ບໍ່ສາມາດລຶບຂໍ້ມູນບັນຊີໄດ້.',
        })
        return
      }

      const newAccounts = accounts.filter((account) => account.id !== id)

      setAccounts(newAccounts as Account[])
      toast({
        description: 'ລຶບຂໍ້ມູນບັນຊີສຳເລັດແລ້ວ.',
      })
    } catch (error) {
      console.error('Error deleting account: ', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
          <DialogTrigger asChild>
            <DropdownMenuItem>ແກ້ໄຂຂໍ້ມູນ</DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem
            onClick={() => handleDeleteAccount(current.id)}
            className='text-danger transition-none focus:text-danger'
          >
            ລຶບຂໍ້ມູນ
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>ແກ້ໄຂຂໍ້ມູນບັນຊີ</DialogTitle>
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
                      ຈຳນວນເງິນ
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled
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
                            disabled
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
                  <FormLabel>ໝາຍເຫດ</FormLabel>
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
                  ແກ້ໄຂຂໍ້ມູນ
                </Button>
              ) : (
                <LoadingButton>ແກ້ໄຂຂໍ້ມູນ</LoadingButton>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
