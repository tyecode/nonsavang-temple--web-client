'use client'

import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'

import { Expense } from '@/types/expense'

import { deleteExpense } from '@/actions/expense-actions'
import { deleteExpenseImage } from '@/actions/image-actions'

import { useExpenseStore } from '@/stores'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData extends Expense>({
  row,
}: DataTableRowActionsProps<TData>) {
  const current: Expense = row.original

  const expenses = useExpenseStore((state) => state.expenses)
  const setExpenses = useExpenseStore((state) => state.setExpenses)

  const { toast } = useToast()

  const handleDeleteExpense = async (id: string) => {
    try {
      const res = await deleteExpense(id)

      if (res.error) {
        toast({
          variant: 'destructive',
          description: 'ມີຂໍ້ຜິດພາດ! ບໍ່ສາມາດລຶບຂໍ້ມູນລາຍຈ່າຍໄດ້.',
        })
        return
      }

      const expense = expenses.find(
        (expense: Expense) => expense.id === current.id
      )

      if (expense?.image) {
        const imageName = expense.image.split('/').pop()

        if (imageName) {
          await deleteExpenseImage(imageName)
        }
      }

      const newExpenses = expenses.filter(
        (expense: Expense) => expense.id !== id
      )

      setExpenses(newExpenses as Expense[])
      toast({
        description: 'ລຶບຂໍ້ມູນລາຍຈ່າຍສຳເລັດແລ້ວ.',
      })
    } catch (error) {
      console.error('Error deleting expense: ', error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='float-right h-8 w-8 p-0'>
          <span className='sr-only'>Open menu</span>
          <DotsHorizontalIcon className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard.writeText(current.id)
            toast({ description: 'ຄັດລອກໄອດີລົງໃນຄລິບບອດແລ້ວ' })
          }}
        >
          ຄັດລອກໄອດີ
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleDeleteExpense(current.id)}
          className='text-danger transition-none focus:text-danger'
        >
          ລຶບຂໍ້ມູນ
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
