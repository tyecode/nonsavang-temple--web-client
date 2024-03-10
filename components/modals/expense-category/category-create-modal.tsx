'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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

import LoadingButton from '@/components/buttons/loading-button'
import { useToast } from '@/components/ui/use-toast'

import { formatDate } from '@/lib/date-format'

import { useExpenseCategoryStore } from '@/stores/useExpenseCategoryStore'

import { Category } from '@/types/category'

import {
  createExpenseCategory,
  getExpenseCategory,
} from '@/actions/expense-category-actions'

const formSchema: any = z.object({
  name: z.string().min(1, {
    message: 'ກະລຸນາປ້ອນປະເພດລາຍຈ່າຍ.',
  }),
})

const CategoryCreateModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, startTransition] = useTransition()

  const setCategories = useExpenseCategoryStore((state) => state.setCategories)

  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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

        const categories = await getExpenseCategory()

        if (categories.error || !categories.data) return

        const newCategories = categories.data.map((category: Category) => ({
          ...category,
          created_at: formatDate(category.created_at),
          updated_at: category.updated_at
            ? formatDate(category.updated_at)
            : undefined,
        }))

        setCategories(newCategories)
        toast({
          description: 'ເພີ່ມຂໍ້ມູນປະເພດລາຍຈ່າຍສຳເລັດແລ້ວ.',
        })
      } catch (error) {
        console.error('Failed to create expense category', error)
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
                  <FormLabel>ຊື່ປະເພດລາຍຈ່າຍ</FormLabel>
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

export default CategoryCreateModal
