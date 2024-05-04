'use client'

import { useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'

import { Account } from '@/types/account'
import { Category } from '@/types/category'
import { Currency } from '@/types/currency'
import { Donator } from '@/types/donator'
import { Income } from '@/types/income'

import { createIncome } from '@/actions/income-actions'
import { getAccount } from '@/actions/account-actions'
import { getDonator } from '@/actions/donator-actions'
import { getIncomeCategory } from '@/actions/income-category-actions'
import { getSession } from '@/actions/auth-actions'

import { useDonatorStore, useIncomeStore } from '@/stores'

import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { LoadingButton } from '@/components/buttons'
import { Textarea } from '@/components/ui/textarea'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
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

import { DonatorCreateModal } from '@/components/modals/donator'
import MonetaryInput from '@/components/monetary-input'
import { incomeSchema } from '@/app/(admin)/incomes/schema'

const IncomeCreateModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [openAccount, setOpenAccount] = useState(false)
  const [openCategory, setOpenCategory] = useState(false)
  const [openCurrency, setOpenCurrency] = useState(false)
  const [openDonator, setOpenDonator] = useState(false)

  const [accounts, setAccounts] = useState<Account[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [currencies, setCurrencies] = useState<Currency[]>([])

  const donators = useDonatorStore((state) => state.donators)
  const setDonators = useDonatorStore((state) => state.setDonators)
  const incomes = useIncomeStore((state) => state.incomes)
  const setIncomes = useIncomeStore((state) => state.setIncomes)

  const form = useForm<z.infer<typeof incomeSchema>>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      account: '',
      category: '',
      amount: '0',
      currency: '',
      donator: null,
      remark: '',
    },
  })

  useEffect(() => {
    const fetchAccount = async () => {
      if (accounts.length > 0) return

      const res = await getAccount()

      if (res.error || !res.data) return

      setAccounts(res.data)
    }

    fetchAccount()
  }, [accounts.length])

  useEffect(() => {
    const fetchCategories = async () => {
      if (categories.length > 0) return

      const res = await getIncomeCategory()

      if (res.error || !res.data) return

      setCategories(res.data)
    }

    fetchCategories()
  }, [categories.length])

  useEffect(() => {
    const fetchDonators = async () => {
      if (donators.length > 0) return

      const res = await getDonator()

      if (res.error || !res.data) return

      setDonators(res.data)
    }

    fetchDonators()
  }, [donators, setDonators])

  const createNewIncome = async (
    values: z.infer<typeof incomeSchema>,
    userId: string
  ) => {
    try {
      const incomeData = {
        user_id: userId,
        account_id: values.account,
        category_id: values.category,
        amount: Number(values.amount),
        currency_id: values.currency,
        donator_id: values.donator ? values.donator : undefined,
        remark: values.remark,
      }

      const res = await createIncome(incomeData)

      if (res.error || !res.data) {
        toast({
          variant: 'destructive',
          description: 'ມີຂໍ້ຜິດພາດ! ເພີ່ມຂໍ້ມູນລາຍຮັບບໍ່ສຳເລັດ.',
        })
        return
      }

      const newIncomes: Income[] = [...incomes, ...res.data]

      setIncomes(newIncomes as Income[])
      toast({
        description: 'ເພີ່ມຂໍ້ມູນລາຍຮັບສຳເລັດແລ້ວ.',
      })
    } catch (error) {
      console.error('Error creating income: ', error)
    } finally {
      setIsOpen(false)
      form.reset()
    }
  }

  const onSubmit = async (values: z.infer<typeof incomeSchema>) => {
    const session = await getSession()

    if (!session) return

    startTransition(async () => await createNewIncome(values, session.user.id))
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
          <DialogTitle>ເພີ່ມຂໍ້ມູນລາຍຮັບ</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='grid gap-2 py-4'
          >
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='account'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel className='pointer-events-none my-[5px]'>
                      ບັນຊີ
                    </FormLabel>
                    <Popover open={openAccount} onOpenChange={setOpenAccount}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            disabled={isPending}
                            variant='outline'
                            role='combobox'
                            aria-expanded={openAccount}
                            className='w-full justify-between'
                          >
                            {field.value
                              ? accounts.find(
                                  (account: Account) =>
                                    account.id === field.value
                                )?.name
                              : 'ເລືອກບັນຊີ...'}
                            <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <FormMessage />
                      <PopoverContent className='w-[180px] p-0'>
                        <Command>
                          <CommandGroup className='max-h-[200px] overflow-y-scroll'>
                            {accounts.map((account: Account) => (
                              <CommandItem
                                key={account.id}
                                value={account.name}
                                onSelect={() => {
                                  field.onChange(account.id)
                                  setCurrencies([account.currency])
                                  form.setValue('currency', account.currency.id)
                                  setOpenAccount(false)
                                }}
                              >
                                {account.name}
                                <CheckIcon
                                  className={cn(
                                    'ml-auto h-4 w-4',
                                    field.value === account.id
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

              <FormField
                control={form.control}
                name='category'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel className='pointer-events-none my-[5px]'>
                      ປະເພດລາຍຮັບ
                    </FormLabel>
                    <Popover open={openCategory} onOpenChange={setOpenCategory}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            disabled={isPending}
                            variant='outline'
                            role='combobox'
                            aria-expanded={openCategory}
                            className='w-full justify-between'
                          >
                            {field.value
                              ? categories.find(
                                  (category: Category) =>
                                    category.id === field.value
                                )?.name
                              : 'ເລືອກປະເພດລາຍຮັບ...'}
                            <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <FormMessage />
                      <PopoverContent className='w-[180px] p-0'>
                        <Command>
                          <CommandGroup className='max-h-[200px] overflow-y-scroll'>
                            {categories.map((category: Category) => (
                              <CommandItem
                                key={category.id}
                                value={category.name}
                                onSelect={() => {
                                  field.onChange(category.id)
                                  setOpenCategory(false)
                                }}
                              >
                                {category.name}
                                <CheckIcon
                                  className={cn(
                                    'ml-auto h-4 w-4',
                                    field.value === category.id
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

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='amount'
                render={({ field: { value, onChange, ...rest } }) => (
                  <FormItem className='w-full'>
                    <FormLabel className='pointer-events-none'>
                      ຈຳນວນເງິນ
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
                            disabled={isPending || !currencies.length}
                            variant='outline'
                            role='combobox'
                            aria-expanded={openCurrency}
                            className='w-full justify-between'
                          >
                            {field.value
                              ? currencies.find(
                                  (currency: Currency) =>
                                    currency.id === field.value
                                )?.code
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
                                value={currency.code}
                                onSelect={() => {
                                  field.onChange(currency.id)
                                  setOpenCurrency(false)
                                }}
                              >
                                {currency.code}
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
              name='donator'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel className='pointer-events-none my-[5px]'>
                    ຜູ້ບໍລິຈາກ
                  </FormLabel>
                  <Popover open={openDonator} onOpenChange={setOpenDonator}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          disabled={isPending}
                          variant='outline'
                          role='combobox'
                          aria-expanded={openDonator}
                          className='w-full justify-between'
                        >
                          {field.value
                            ? donators.find(
                                (donator: Donator) => donator.id === field.value
                              )?.display_name
                            : 'ເລືອກຜູ້ບໍລິຈາກ...'}
                          <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <FormMessage />
                    <PopoverContent className='w-[376px] p-0'>
                      <Command>
                        <CommandInput
                          placeholder='ຄົ້ນຫາລາຍຊື່ຜູ້ບໍລິຈາກ...'
                          className='h-9'
                        />
                        <CommandEmpty className='flex-center flex-col p-1'>
                          <span className='p-3 text-sm text-foreground/60'>
                            ບໍ່ພົບລາຍຊື່ຜູ້ບໍລິຈາກທີ່ຄົ້ນຫາ.
                          </span>
                          <DonatorCreateModal asChild />
                        </CommandEmpty>
                        <CommandGroup className='max-h-[200px] overflow-y-scroll'>
                          <CommandItem
                            key='default'
                            value='0'
                            onSelect={() => {
                              field.onChange(null)
                              setOpenDonator(false)
                            }}
                          >
                            {'ເລືອກຜູ້ບໍລິຈາກ...'}
                            <CheckIcon
                              className={cn(
                                'ml-auto h-4 w-4',
                                field.value === null
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                          </CommandItem>
                          {donators.map((donator: Donator) => (
                            <CommandItem
                              key={donator.id}
                              value={donator.display_name}
                              onSelect={() => {
                                field.onChange(donator.id)
                                setOpenDonator(false)
                              }}
                            >
                              {donator.display_name}
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  field.value === donator.id
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

            <div className='mt-2 flex w-full justify-end'>
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

export default IncomeCreateModal
