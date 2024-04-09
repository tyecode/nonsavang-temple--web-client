'use client'

import { Row } from '@tanstack/react-table'
import { useState, useTransition, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'

import { Currency } from '@/types/currency'

import { deleteCurrency, updateCurrency } from '@/actions/currency-actions'

import { useCurrencyStore } from '@/stores'

import { Button } from '@/components/ui/button'
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
import { LoadingButton } from '@/components/buttons'
import { useToast } from '@/components/ui/use-toast'
import { currencySchema } from './schema'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData extends Currency>({
  row,
}: DataTableRowActionsProps<TData>) {
  const current: Currency = row.original

  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const currencies = useCurrencyStore((state) => state.currencies)
  const setCurrencies = useCurrencyStore((state) => state.setCurrencies)

  const { toast } = useToast()

  const form: any = useForm<z.infer<typeof currencySchema>>({
    resolver: zodResolver(currencySchema),
  })

  useEffect(() => {
    form.setValue('code', current.code)
    form.setValue('name', current.name)
    form.setValue('symbol', current.symbol)
  }, [current, form])

  const onSubmit = (values: z.infer<typeof currencySchema>) => {
    startTransition(async () => {
      try {
        const res = await updateCurrency(current.id, {
          code: values.code,
          name: values.name,
          updated_at: new Date(),
        })

        if (res.error || !res.data) {
          toast({
            variant: 'destructive',
            description: 'ມີຂໍ້ຜິດພາດ! ບໍ່ສາມາດແກ້ໄຂຂໍ້ມູນສະກຸນເງິນໄດ້.',
          })
          return
        }

        const newCurrencies = currencies.map((currency: Currency) => {
          const updatedCurrency: Currency = res.data?.find(
            (item) => item.id === currency.id
          )

          if (updatedCurrency) return updatedCurrency

          return currency
        })

        setCurrencies(newCurrencies as Currency[])
        toast({
          description: 'ແກ້ໄຂຂໍ້ມູນສະກຸນເງິນສຳເລັດແລ້ວ.',
        })
      } catch (error) {
        console.error('Error updating currency:', error)
      } finally {
        setIsOpen(false)
      }
    })
  }

  const handleDeleteCurrency = async (id: string) => {
    try {
      const res = await deleteCurrency(id)

      if (res.error) {
        toast({
          variant: 'destructive',
          description: 'ມີຂໍ້ຜິດພາດ! ບໍ່ສາມາດລຶບຂໍ້ມູນສະກຸນເງິນໄດ້.',
        })
        return
      }

      const newCurrencies = currencies.filter((currency) => currency.id !== id)

      setCurrencies(newCurrencies as Currency[])
      toast({
        description: 'ລຶບຂໍ້ມູນສະກຸນເງິນສຳເລັດແລ້ວ.',
      })
    } catch (error) {
      console.error('Error deleting currency: ', error)
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
            onClick={() => handleDeleteCurrency(current.id)}
            className='text-danger transition-none focus:text-danger'
          >
            ລົບຂໍ້ມູນ
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>ແກ້ໄຂຂໍ້ມູນສະກຸນເງິນ</DialogTitle>
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
                      disabled
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
                    <Input disabled {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='mt-2 flex w-full justify-end'>
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
