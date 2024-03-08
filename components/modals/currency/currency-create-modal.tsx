'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import LoadingButton from '@/components/buttons/loading-button'
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
import { useToast } from '@/components/ui/use-toast'

import { createCurrency, getCurrency } from '@/actions/currency-actions'
import { useCurrencyStore } from '@/stores'
import { formatDate } from '@/lib/date-format'
import { Currency } from '@/types/currency'

const formSchema: any = z.object({
  code: z
    .string()
    .min(1, {
      message: 'ກະລຸນາປ້ອນລະຫັດສະກຸນເງິນ.',
    })
    .regex(/^[A-Z]{3}$/, {
      message: 'ລະຫັດສະກຸນເງິນຕ້ອງມີຕົວອັກສອນ 3 ຕົວເທົ່ານັ້ນ.',
    }),
  name: z.string().min(1, {
    message: 'ກະລຸນາປ້ອນສະກຸນເງິນ.',
  }),
})

const CurrencyCreateModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, startTransition] = useTransition()

  const setCurrencies = useCurrencyStore((state) => state.setCurrencies)

  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      name: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      try {
        const res = await createCurrency({
          code: values.code,
          name: values.name,
        })

        if (res.error || !res.data) {
          toast({
            variant: 'destructive',
            description: 'ມີຂໍ້ຜິດພາດ! ເພີ່ມຂໍ້ມູນສະກຸນເງິນບໍ່ສຳເລັດ.',
          })
          return
        }

        const currencies = await getCurrency()

        if (currencies.error || !currencies.data) return

        const newCurrencies = currencies.data.map((currency: Currency) => ({
          ...currency,
          created_at: formatDate(currency.created_at),
          updated_at: currency.updated_at
            ? formatDate(currency.updated_at)
            : undefined,
        }))

        setCurrencies(newCurrencies)
        toast({
          description: 'ເພີ່ມຂໍ້ມູນສະກຸນເງິນສຳເລັດແລ້ວ.',
        })
      } catch (error) {
        console.error('Failed to create currency', error)
      } finally {
        setIsOpen(false)
        form.reset()
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {isLoading ? (
          <LoadingButton>ເພິ່ມຂໍ້ມູນ</LoadingButton>
        ) : (
          <Button size={'sm'}>ເພິ່ມຂໍ້ມູນ</Button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>ເພິ່ມຂໍ້ມູນສະກຸນເງິນ</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='grid gap-2 py-4'
          >
            <FormField
              control={form.control}
              name='code'
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem className='flex-1'>
                  <FormLabel>ລະຫັດ</FormLabel>
                  <FormControl>
                    <Input
                      onChange={(e) => onChange(e.target.value.toUpperCase())}
                      value={value.toUpperCase()}
                      {...rest}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel>ຊື່ສະກຸນເງິນ</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='mt-2 flex w-full justify-end'>
              {!isLoading ? (
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

export default CurrencyCreateModal
