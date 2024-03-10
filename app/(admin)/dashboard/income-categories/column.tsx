/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ColumnDef } from '@tanstack/react-table'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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

import LoadingButton from '@/components/buttons/loading-button'
import { useToast } from '@/components/ui/use-toast'

import { formatDate } from '@/lib/date-format'

import {
  deleteExpenseCategory,
  updateExpenseCategory,
} from '@/actions/expense-category-actions'

import { useExpenseCategoryStore } from '@/stores/useExpenseCategoryStore'

import { Category } from '@/types/category'

const formSchema: any = z.object({
  name: z.string().min(1, {
    message: 'ກະລຸນາປ້ອນປະເພດລາຍຈ່າຍ.',
  }),
})

export const columns: ColumnDef<Category>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value: boolean) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'ຊື່ປະເພດລາຍຈ່າຍ',
  },
  {
    accessorKey: 'created_at',
    header: 'ສ້າງວັນທີ່',
  },
  {
    accessorKey: 'updated_at',
    header: 'ອັບເດດວັນທີ່',
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const [isOpen, setIsOpen] = useState(false)
      const [isPending, startTransition] = useTransition()

      const categories = useExpenseCategoryStore((state) => state.categories)
      const setCategories = useExpenseCategoryStore(
        (state) => state.setCategories
      )

      const { toast } = useToast()

      const current = row.original

      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: current.name,
        },
      })

      const onSubmit = (values: z.infer<typeof formSchema>) => {
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

              if (updatedCategory) {
                return {
                  ...updatedCategory,
                  created_at: formatDate(updatedCategory.created_at),
                  updated_at: updatedCategory.updated_at
                    ? formatDate(updatedCategory.updated_at)
                    : undefined,
                }
              }

              return category
            })

            setCategories(newCategories)
            toast({
              description: 'ແກ້ໄຂຂໍ້ມູນປະເພດລາຍຈ່າຍສຳເລັດແລ້ວ.',
            })
          } catch (error) {
            console.error('Error updating expense category:', error)
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

          const newCategories = categories.filter(
            (category) => category.id !== id
          )

          setCategories(newCategories)
          toast({
            description: 'ລຶບຂໍ້ມູນປະເພດລາຍຈ່າຍສຳເລັດແລ້ວ.',
          })
        } catch (error) {
          console.error('Error deleting expense category:', error)
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
    },
  },
]
