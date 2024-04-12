'use client'

import { useState, useEffect, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Row } from '@tanstack/react-table'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'

import { Category } from '@/types/category'

import {
  deleteExpenseCategory,
  updateExpenseCategory,
} from '@/actions/expense-category-actions'

import { useExpenseCategoryStore } from '@/stores'

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

import { expenseCategorySchema } from './schema'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData extends Category>({
  row,
}: DataTableRowActionsProps<TData>) {
  const current: Category = row.original

  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const categories = useExpenseCategoryStore((state) => state.categories)
  const setCategories = useExpenseCategoryStore((state) => state.setCategories)

  const { toast } = useToast()

  const form = useForm<z.infer<typeof expenseCategorySchema>>({
    resolver: zodResolver(expenseCategorySchema),
  })

  useEffect(() => {
    form.reset({
      name: current.name,
    })
  }, [current, form])

  const onSubmit = (values: z.infer<typeof expenseCategorySchema>) => {
    startTransition(async () => {
      try {
        const res = await updateExpenseCategory(current.id, {
          name: values.name,
          updated_at: new Date(),
        })

        if (res.error || !res.data) {
          toast({
            variant: 'destructive',
            description: 'ມີຂໍ້ຜິດພາດ! ບໍ່ສາມາດແກ້ໄຂຂໍ້ມູນປະເພດລາຍຈ່າຍໄດ້.',
          })
          return
        }

        const newCategories = categories.map((category: Category) => {
          const updatedCategory: Category = res.data?.find(
            (item) => item.id === category.id
          )

          if (updatedCategory) return updatedCategory

          return category
        })

        setCategories(newCategories as Category[])
        toast({
          description: 'ແກ້ໄຂຂໍ້ມູນປະເພດລາຍຈ່າຍສຳເລັດແລ້ວ.',
        })
      } catch (error) {
        console.error('Error updating expense category: ', error)
      } finally {
        setIsOpen(false)
      }
    })
  }

  const handleDeleteCategory = async (id: string) => {
    try {
      const res = await deleteExpenseCategory(id)

      if (res.error || !res.data) {
        toast({
          variant: 'destructive',
          description: 'ມີຂໍ້ຜິດພາດ! ບໍ່ສາມາດລຶບຂໍ້ມູນປະເພດລາຍຈ່າຍໄດ້.',
        })
        return
      }

      const newCategories = categories.filter((category) => category.id !== id)

      setCategories(newCategories)
      toast({
        description: 'ລຶບຂໍ້ມູນປະເພດລາຍຈ່າຍສຳເລັດແລ້ວ.',
      })
    } catch (error) {
      console.error('Error deleting expense category: ', error)
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
            onClick={() => handleDeleteCategory(current.id)}
            className='text-danger transition-none focus:text-danger'
          >
            ລຶບຂໍ້ມູນ
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>ແກ້ໄຂຂໍ້ມູນປະເພດລາຍຈ່າຍ</DialogTitle>
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
