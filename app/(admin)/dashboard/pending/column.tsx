'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'

import { Transaction } from '@/types'

import { useTransactionStore } from '@/stores/useTransactionStore'
import { useApprovedTransactionStore } from '@/stores/useApprovedTransactionStore'

import { updateIncome } from '@/actions/income-actions'
import { updateExpense } from '@/actions/expense-actions'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { toast, useToast } from '@/components/ui/use-toast'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const columns: ColumnDef<Transaction>[] = [
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
    accessorKey: 'account.name',
    header: 'ຊື່ບັນຊີ',
    cell: ({ row }) => (
      <span
        className='cursor-pointer'
        onClick={() => {
          navigator.clipboard.writeText(row.original.account.id)
          toast({ description: 'ຄັດລອກໄອດີລົງໃນຄລິບບອດແລ້ວ' })
        }}
      >
        {row.original.account.name}
      </span>
    ),
  },
  {
    accessorKey: 'transaction_type',
    header: 'ປະເພດລາຍການ',
    cell: ({ row }) => (
      <Badge
        className='flex-center w-16'
        variant={
          row.original.transaction_type === 'income' ? 'success' : 'danger'
        }
      >
        {row.original.transaction_type === 'income' ? 'ລາຍຮັບ' : 'ລາຍຈ່າຍ'}
      </Badge>
    ),
  },
  {
    accessorKey: 'category.name',
    header: 'ປະເພດລາຍຮັບ/ລາຍຈ່າຍ',
    cell: ({ row }) => (
      <span
        className='cursor-pointer'
        onClick={() => {
          navigator.clipboard.writeText(row.original.category.id)
          toast({ description: 'ຄັດລອກໄອດີລົງໃນຄລິບບອດແລ້ວ' })
        }}
      >
        {row.original.category.name}
      </span>
    ),
  },
  {
    accessorKey: 'participant.display_name',
    header: 'ຜູ້ບໍລິຈາກ/ຜູ້ເບີກຈ່າຍ',
    cell: ({ row }) => {
      if (!row.original.participant?.display_name) return <>--</>

      return (
        <span
          className='cursor-pointer'
          onClick={() => {
            if (row.original.participant) {
              navigator.clipboard.writeText(row.original.participant.id)
              toast({ description: 'ຄັດລອກໄອດີລົງໃນຄລິບບອດແລ້ວ' })
            }
          }}
        >
          {row.original.participant.display_name}
        </span>
      )
    },
  },
  {
    accessorKey: 'amount',
    header: 'ຈຳນວນເງິນ',
    cell: ({ row }) => {
      const current = row.original

      return current.transaction_type === 'income' &&
        current.currency.symbol ? (
        <span className='font-medium'>{`${current.currency.symbol}${current.amount.toLocaleString()}`}</span>
      ) : (
        <span className='font-medium'>{`-${current.currency.symbol}${current.amount.toLocaleString()}`}</span>
      )
    },
  },
  {
    accessorKey: 'remark',
    header: 'ໝາຍເຫດ',
    cell: ({ row }) => {
      const current = row.original

      return current.remark ? (
        <span className='text-sm'>{current.remark}</span>
      ) : (
        <span className='text-sm'>--</span>
      )
    },
  },
  {
    accessorKey: 'created_at',
    header: 'ສ້າງວັນທີ່',
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const current = row.original

      const transactions = useTransactionStore((state) => state.transactions)
      const setTransactions = useTransactionStore(
        (state) => state.setTransactions
      )
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
          if (transaction_type === 'income') {
            const res = await updateIncome(id, {
              status,
              ...(status === 'APPROVED' && { approved_at: new Date() }),
              ...(status === 'REJECTED' && { rejected_at: new Date() }),
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

            const newApprovedTransactions = transactions.map(
              (transaction: Transaction) => {
                const updatedTransaction = res.data?.find(
                  (item: Transaction) => item.id === transaction.id
                )

                if (updatedTransaction) {
                  return {
                    ...updatedTransaction,
                    ...(status === 'APPROVED' && { approved_at: new Date() }),
                    ...(status === 'REJECTED' && { rejected_at: new Date() }),
                    transaction_type,
                    status,
                  }
                }

                return transaction
              }
            )

            setTransactions(newTransactions as Transaction[])
            setApprovedTransactions(newApprovedTransactions as Transaction[])
            toast({
              description: `${status === 'APPROVED' ? 'ຍອມຮັບ' : 'ປະຕິເສດ'}ລາຍການສຳເລັດແລ້ວ.`,
            })
          }

          if (transaction_type === 'expense') {
            const res = await updateExpense(id, {
              status,
              ...(status === 'APPROVED' && { approved_at: new Date() }),
              ...(status === 'REJECTED' && { rejected_at: new Date() }),
            })

            if (res.error || !res.data) {
              toast({
                variant: 'destructive',
                description: `ມີຂໍ້ຜິດພາດ! ບໍ່ສາມາດ${status === 'APPROVED' ? 'ຍອມຮັບ' : 'ປະຕິເສດ'}ໄດ້.`,
              })
              return
            }

            const newTransactions = transactions.map(
              (transaction: Transaction) => {
                const updatedTransaction = res.data?.find(
                  (item: Transaction) => item.id === transaction.id
                )

                if (updatedTransaction) {
                  return {
                    ...updatedTransaction,
                    ...(status === 'APPROVED' && { approved_at: new Date() }),
                    ...(status === 'REJECTED' && { rejected_at: new Date() }),
                    transaction_type,
                    status,
                  }
                }

                return transaction
              }
            )

            setTransactions(
              newTransactions.filter(
                (transaction) => transaction.status.toLowerCase() === 'pending'
              )
            )
            toast({
              description: `${status === 'APPROVED' ? 'ຍອມຮັບ' : 'ປະຕິເສດ'}ລາຍການສຳເລັດແລ້ວ.`,
            })
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
              ຍອມຮັບ
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
    },
  },
]
