'use client'

import { Row } from '@tanstack/react-table'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'

import { Transaction } from '@/types'

import { useTransactionStore } from '@/stores/useTransactionStore'
import { useApprovedTransactionStore } from '@/stores/useApprovedTransactionStore'

import { updateIncome } from '@/actions/income-actions'
import { updateExpense } from '@/actions/expense-actions'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData extends Transaction>({
  row,
}: DataTableRowActionsProps<TData>) {
  const current: Transaction = row.original

  const transactions = useTransactionStore((state) => state.transactions)
  const approvedTransactions = useApprovedTransactionStore(
    (state) => state.transactions
  )
  const setTransactions = useTransactionStore((state) => state.setTransactions)
  const setApprovedTransactions = useApprovedTransactionStore(
    (state) => state.setTransactions
  )

  const { toast } = useToast()

  const handleUpdateTransaction = async (
    id: string,
    transaction_type: string,
    status: string
  ) => {
    try {
      const handleTransaction = async (
        transaction_type: string,
        updateFunction: Function
      ) => {
        const dateField = status === 'APPROVED' ? 'approved_at' : 'rejected_at'

        if (status === 'APPROVED') {
          const transaction = transactions.find((item) => item.id === id)

          if (transaction) {
            const { account, amount } = transaction
            const sum = account.balance + amount

            console.log('APPROVED', transaction)
            console.log('APPROVED', sum)
          }
        }

        return

        const res = await updateFunction(id, {
          status,
          [dateField]: new Date(),
        })

        if (res.error || !res.data) {
          toast({
            variant: 'destructive',
            description: `ມີຂໍ້ຜິດພາດ! ບໍ່ສາມາດ${status === 'APPROVED' ? 'ຍອມຮັບ' : 'ປະຕິເສດ'}ໄດ້.`,
          })
          return
        }

        const newTransactions = transactions.filter(
          (transaction) => transaction.id !== id
        )

        const newApprovedTransactions = res.data?.map(
          (transaction: Transaction) => {
            return {
              ...transaction,
              [dateField]: new Date(),
              status,
              transaction_type,
            }
          }
        )

        const updatedApprovedTransactions = [
          ...(approvedTransactions || []),
          ...newApprovedTransactions,
        ]

        setTransactions(newTransactions as Transaction[])
        setApprovedTransactions(updatedApprovedTransactions as Transaction[])
        toast({
          description: `${status === 'APPROVED' ? 'ຍອມຮັບ' : 'ປະຕິເສດ'}ລາຍການສຳເລັດແລ້ວ.`,
        })
      }

      if (transaction_type === 'income') {
        await handleTransaction('income', updateIncome)
      }

      if (transaction_type === 'expense') {
        await handleTransaction('expense', updateExpense)
      }
    } catch (error) {
      console.error('Error updating transaction: ', error)
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
          onClick={() =>
            handleUpdateTransaction(
              current.id,
              current.transaction_type,
              'APPROVED'
            )
          }
          className='text-success transition-none focus:text-success'
        >
          ອະນຸມັດ
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            handleUpdateTransaction(
              current.id,
              current.transaction_type,
              'REJECTED'
            )
          }
          className='text-danger transition-none focus:text-danger'
        >
          ປະຕິເສດ
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
