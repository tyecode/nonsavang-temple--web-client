'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Category } from '@/types/category'

import { createExpenseCategory } from '@/actions/expense-category-actions'

import { useExpenseCategoryStore } from '@/stores'

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

import { expenseCategorySchema } from './schema'

export const ExpenseCategoryCreateModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const categories = useExpenseCategoryStore((state) => state.categories)
  const setCategories = useExpenseCategoryStore((state) => state.setCategories)

  const { toast } = useToast()

  const form = useForm<z.infer<typeof expenseCategorySchema>>({
    resolver: zodResolver(expenseCategorySchema),
    defaultValues: {
      name: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof expenseCategorySchema>) => {
    startTransition(async () => {
      try {
        const res = await createExpenseCategory({
          name: values.name,
        })

        if (res.error || !res.data) {
          toast({
            variant: 'destructive',
            description: 'ມີຂໍ້ຜິດພາດ! ເພີ່ມຂໍ້ມູນປະເພດລາຍຈ່າຍບໍ່ສຳເລັດ.',
          })
          return
        }

        const newCategories: Category[] = [...categories, ...res.data]

        setCategories(newCategories as Category[])
        toast({
          description: 'ເພີ່ມຂໍ້ມູນປະເພດລາຍຈ່າຍສຳເລັດແລ້ວ.',
        })
      } catch (error) {
        console.error('Failed to create expense category: ', error)
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
          <DialogTitle>ເພິ່ມຂໍ້ມູນປະເພດລາຍຈ່າຍ</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='grid gap-2 py-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel className='pointer-events-none'>
                    ຊື່ປະເພດລາຍຈ່າຍ
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
