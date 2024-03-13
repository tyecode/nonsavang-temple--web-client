'use client'

import { ChangeEvent, useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Currency } from '@/types/currency'
import { Account } from '@/types/account'
import { Expense } from '@/types/expense'
import { Category } from '@/types/category'

import { getAccount } from '@/actions/account-actions'
import { getSession } from '@/actions/auth-actions'
import { createExpense, getExpense } from '@/actions/expense-actions'
import { getExpenseCategory } from '@/actions/expense-category-actions'
import { uploadExpenseImage } from '@/actions/image-actions'

import { useExpenseStore } from '@/stores'

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
  account: z.string().min(1, 'ກະລຸນາເລືອກບັນຊີ.'),
  category: z.string().min(1, 'ກະລຸນາເລືອກປະເພດລາຍຈ່າຍ.'),
  amount: z
    .string()
    .min(1, 'ກະລຸນາປ້ອນຈຳນວນເງິນ.')
    .regex(/^[-]?\d+$/, {
      message: 'ຈຳນວນເງິນຕ້ອງເປັນຕົວເລກເທົ່ານັ້ນ.',
    })
    .refine((value) => Number(value) > 0, {
      message: 'ປ້ອນຈຳນວນເງິນບໍ່ຖືກຕ້ອງ.',
    }),
  currency: z.string().min(1, 'ກະລຸນາເລືອກສະກຸນເງິນ.'),
  image: z
    .custom<FileList>()
    .transform((file) => file.length > 0 && file.item(0))
    .refine((file) => !file || (!!file && file.type?.startsWith('image')), {
      message: 'ອັບໂຫຼດໄດ້ສະເພາະຮູບພາບເທົ່ານັ້ນ.',
    })
    .refine((file) => !file || (!!file && file.size <= 10 * 1024 * 1024), {
      message: 'ຮູບພາບຕ້ອງມີຂະໜາດບໍ່ເກີນ 10MB.',
    }),
  remark: z.string(),
})

const ExpenseCreateModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [currency, setCurrency] = useState<Currency[]>([])
  const setExpenses = useExpenseStore((state) => state.setExpenses)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      account: '',
      category: '',
      amount: '0',
      currency: '',
      image: '',
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

      const res = await getExpenseCategory()

      if (res.error || !res.data) return

      setCategories(res.data)
    }

    fetchCategories()
  }, [categories.length])

  const createNewExpense = async (
    values: z.infer<typeof formSchema>,
    uploadData?: { data: any; error?: null; message?: string }
  ) => {
    try {
      const expenseData = {
        user_id: values.user_id,
        account_id: values.account,
        category_id: values.category,
        amount: Number(values.amount),
        currency_id: values.currency,
        image: uploadData
          ? `${process.env.NEXT_PUBLIC_BUCKET_PATH}/${uploadData.data.path}`
          : undefined,
        remark: values.remark,
      }

      const res = await createExpense(expenseData)

      if (res.error || !res.data) {
        toast({
          description: 'ມີຂໍ້ຜິດພາດ! ເພີ່ມຂໍ້ມູນລາຍຈ່າຍບໍ່ສຳເລັດ.',
        })
        return
      }

      const expenses = await getExpense()

      if (expenses.error || !expenses.data) return

      const newExpenses: Expense[] = expenses.data.map((expense: Expense) => ({
        ...expense,
        created_at: formatDate(expense.created_at),
        approved_at: expense.approved_at
          ? formatDate(expense.approved_at)
          : undefined,
        rejected_at: expense.rejected_at
          ? formatDate(expense.rejected_at)
          : undefined,
      }))

      setExpenses(newExpenses)
      toast({
        description: 'ເພີ່ມຂໍ້ມູນລາຍຈ່າຍສຳເລັດແລ້ວ.',
      })
    } catch (error) {
      console.error('Error creating expense:', error)
    } finally {
      setIsOpen(false)
      form.reset()
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const session = await getSession()

    if (!session) return

    startTransition(async () => {
      if (!values.image) {
        await createNewExpense({ ...values, user_id: session.user.id })
        return
      }

      const uploadData = await uploadExpenseImage(values.image)

      if (uploadData.error || !uploadData.data) {
        throw new Error('Image upload failed')
      }

      await createNewExpense(
        { ...values, user_id: session.user.id },
        uploadData
      )
    })
  }

  const getImageData = (event: ChangeEvent<HTMLInputElement>) => {
    const dataTransfer = new DataTransfer()

    Array.from(event.target.files!).forEach((image) =>
      dataTransfer.items.add(image)
    )

    const files = dataTransfer.files
    const displayUrl = URL.createObjectURL(event.target.files![0])

    return { files, displayUrl }
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
          <DialogTitle>ເພີ່ມຂໍ້ມູນລາຍຈ່າຍ</DialogTitle>
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
                  <FormItem>
                    <FormLabel>ເລືອກບັນຊີ</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={(value) => {
                        field.onChange(value)

                        const account = accounts.find((acc) => acc.id === value)
                        if (!account) return

                        setCurrency([account.currency])
                        form.setValue('currency', '')
                      }}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='flex-full'>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {accounts?.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='category'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ເລືອກປະເພດ</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='flex-full'>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((category, index) => (
                          <SelectItem
                            key={`category-${index}`}
                            value={category.id}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='amount'
                render={({ field: { onChange, ...rest } }) => (
                  <FormItem className='w-full'>
                    <FormLabel>ຈຳນວນເງິນ</FormLabel>
                    <FormControl>
                      <Input
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
                  <FormItem>
                    <FormLabel>ສະກຸນເງິນ</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          className='w-full'
                          disabled={currency.length === 0}
                        >
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currency.map((currency, index) => (
                          <SelectItem
                            key={`currency-${index}`}
                            value={currency.id}
                          >
                            {currency.code}
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
              name='image'
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>ຮູບພາບ</FormLabel>
                  <FormControl>
                    <Input
                      type='file'
                      accept='image/*'
                      onChange={(event) => {
                        const { files, displayUrl } = getImageData(event)
                        onChange(files)
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
              name='remark'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ໝາຍເຫດ</FormLabel>
                  <Textarea className='col-span-3' {...field} />
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

export default ExpenseCreateModal
