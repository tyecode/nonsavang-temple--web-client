'use client'

import { useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Currency } from '@/types/currency'
import { Account } from '@/types/account'

import { createAccount, getAccount } from '@/actions/account-actions'
import { getCurrency } from '@/actions/currency-actions'
import { getSession } from '@/actions/auth-actions'

import { useAccountStore } from '@/stores'

import { formatDate } from '@/lib/date-format'

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { LoadingButton } from '@/components/buttons'

import { toast } from '@/components/ui/use-toast'

const formSchema: any = z.object({
  balance: z
    .string()
    .min(1, 'ປ້ອນຈຳນວນເງິນ.')
    .regex(/^[-]?\d+$/, {
      message: 'ຈຳນວນເງິນຕ້ອງເປັນຕົວເລກເທົ່ານັ້ນ.',
    })
    .refine((value) => Number(value) >= 0, {
      message: 'ປ້ອນຈຳນວນເງິນບໍ່ຖືກຕ້ອງ.',
    }),
  currency: z.string(),
  remark: z.string(),
})

const AccountCreateModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<Currency[]>([])
  const [isPending, startTransition] = useTransition()
  const setAccounts = useAccountStore((state) => state.setAccounts)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      balance: '0',
      currency: 'LAK',
      remark: '',
    },
  })

  useEffect(() => {
    const getCurrencyData = async () => {
      try {
        const res = await getCurrency()

        if (res.error || !res.data) return

        const sortedData = res.data.sort(
          (a: { code: string }, b: { code: string }) =>
            a.code.localeCompare(b.code)
        )
        setOptions(sortedData)
      } catch (error) {
        console.error('Error fetching currency:', error)
      }
    }

    if (options.length > 0) return

    getCurrencyData()
  }, [options])

  const createNewAccount = async (
    values: z.infer<typeof formSchema>,
    user: { id: string; first_name: string; last_name: string },
    currency: { id: string; code: string; name: string }
  ) => {
    try {
      const accountData = {
        balance: Number(values.balance),
        currency_id: currency.id,
        remark: values.remark,
        user_id: user.id,
      }

      const res = await createAccount(accountData)

      if (res.error || !res.data) {
        toast({
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

    if (!session || options.length === 0) return

    startTransition(
      async () =>
        await createNewAccount(
          values,
          {
            id: session.user.id,
            first_name: session.user.user_metadata.first_name,
            last_name: session.user.user_metadata.last_name,
          },
          options.find((item) => item.code === values.currency)!
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
            <div className='flex gap-4'>
              <FormField
                control={form.control}
                name='balance'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>ຈຳນວນເງິນຕັ້ງຕົ້ນ</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='currency'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ສະກຸນເງິນ</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='w-32'>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {options.map((option, index) => (
                          <SelectItem
                            key={`option-${index}`}
                            value={option.code}
                          >
                            {option.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
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
                  <Textarea className='col-span-3' {...field} />
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
