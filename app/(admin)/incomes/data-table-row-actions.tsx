'use client'

import { Row } from '@tanstack/react-table'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'

import { Income } from '@/types/income'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { deleteIncome } from '@/actions/income-actions'

import { useIncomeStore } from '@/stores'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData extends Income>({
  row,
}: DataTableRowActionsProps<TData>) {
  const current: Income = row.original

  const incomes = useIncomeStore((state) => state.incomes)
  const setIncomes = useIncomeStore((state) => state.setIncomes)

  const { toast } = useToast()

  const handleDeleteIncome = async (id: string) => {
    try {
      const res = await deleteIncome(id)

      if (res.error) {
        toast({
          variant: 'destructive',
          description: 'ມີຂໍ້ຜິດພາດ! ບໍ່ສາມາດລຶບຂໍ້ມູນລາຍຮັບໄດ້.',
        })
        return
      }

      const newIncomes = incomes.filter((income: Income) => income.id !== id)

      setIncomes(newIncomes as Income[])
      toast({
        description: 'ລຶບຂໍ້ມູນລາຍຮັບສຳເລັດແລ້ວ.',
      })
    } catch (error) {
      console.error('Error deleting incomes: ', error)
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
          onClick={() => handleDeleteIncome(current.id)}
          className='text-danger transition-none focus:text-danger'
        >
          ລຶບຂໍ້ມູນ
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
