'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { symbol, z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Currency } from '@/types/currency'

import { createCurrency, getCurrency } from '@/actions/currency-actions'

import { useCurrencyStore } from '@/stores'
import { CurrencyState } from '@/stores/useCurrencyStore'

import { formatDate } from '@/lib/date-format'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingButton } from '@/components/buttons'
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
    message: 'ກະລຸນາປ້ອນຊື່ສະກຸນເງິນ.',
  }),
  symbol: z.string().min(1, {
    message: 'ກະລຸນາປ້ອນສັນຍາລັກສະກຸນເງິນ.',
  }),
})

const CurrencyCreateModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const setCurrencies = useCurrencyStore(
    (state: CurrencyState) => state.setCurrencies
  )

  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      name: '',
      symbol: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      try {
        const res = await createCurrency({
          code: values.code,
          name: values.name,
          symbol: values.symbol,
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
        {isPending ? (
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
                  <FormLabel className='pointer-events-none'>
                    ລະຫັດສະກຸນເງິນ
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
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
                  <FormLabel className='pointer-events-none'>
                    ຊື່ສະກຸນເງິນ
                  </FormLabel>
                  <FormControl>
                    <Input disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='symbol'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel className='pointer-events-none'>
                    ສັນຍາລັກ
                  </FormLabel>
                  <FormControl>
                    <Input disabled={isPending} {...field} />
                  </FormControl>
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

export default CurrencyCreateModal
