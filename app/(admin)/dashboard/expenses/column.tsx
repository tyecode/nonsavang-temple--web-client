'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

import { Expense } from '@/types/expense'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast, useToast } from '@/components/ui/use-toast'

import { deleteExpense } from '@/actions/expense-actions'
import { deleteExpenseImage } from '@/actions/image-actions'

import { useExpenseStore } from '@/stores'
import { formatDate } from '@/lib/date-format'

export const columns: ColumnDef<Expense>[] = [
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
    accessorKey: 'category.name',
    header: 'ປະເພດລາຍຈ່າຍ',
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
    accessorKey: 'drawer.display_name',
    header: 'ຜູ້ເບີກຈ່າຍ',
    cell: ({ row }) => {
      const drawer = row.original.drawer

      return drawer ? (
        <span
          className='cursor-pointer'
          onClick={() => {
            navigator.clipboard.writeText(drawer.id)
            toast({ description: 'ຄັດລອກໄອດີລົງໃນຄລິບບອດແລ້ວ' })
          }}
        >
          {drawer.display_name}
        </span>
      ) : (
        '--'
      )
    },
  },
  {
    accessorKey: 'amount',
    header: 'ຈຳນວນເງິນ',
    cell: ({ row }) => {
      const current = row.original

      return current.currency && current.currency.symbol ? (
        <span className='whitespace-nowrap'>
          {current.amount < 0 ? '-' : ''}
          {current.currency.symbol}
          {Math.abs(current.amount).toLocaleString()}
        </span>
      ) : (
        '--'
      )
    },
  },
  {
    accessorKey: 'image',
    header: 'ຮູບພາບ',
    cell: ({ row }) => {
      const image = row.original.image

      return image ? (
        <Button size={'sm'} variant={'link'} className='m-0 p-0'>
          <Link href={image} target='_blank'>
            ເບິ່ງຮູບພາບ
          </Link>
        </Button>
      ) : (
        '--'
      )
    },
  },
  {
    accessorKey: 'remark',
    header: 'ໝາຍເຫດ',
  },
  {
    accessorKey: 'status',
    header: 'ສະຖານະ',
    cell: ({ row }) => (
      <>
        {row.original.status === 'PENDING' && (
          <Badge variant={'warning'} className='whitespace-nowrap'>
            ລໍຖ້າການອະນຸມັດ
          </Badge>
        )}
        {row.original.status === 'APPROVED' && (
          <Badge variant={'success'} className='whitespace-nowrap'>
            ອະນຸມັດແລ້ວ
          </Badge>
        )}
        {row.original.status === 'REJECTED' && (
          <Badge variant={'danger'} className='whitespace-nowrap'>
            ຖືກປະຕິເສດ
          </Badge>
        )}
      </>
    ),
  },
  {
    accessorKey: 'created_at',
    header: 'ສ້າງວັນທີ່',
    cell: ({ row }) => {
      const current = row.original

      return formatDate(current.created_at)
    },
  },
  {
    accessorKey: 'approved_at',
    header: 'ອະນຸມັດວັນທີ່',
    cell: ({ row }) => {
      const current = row.original

      return current.approved_at ? formatDate(current.approved_at) : '--'
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const expenses = useExpenseStore((state) => state.expenses)
      const setExpenses = useExpenseStore((state) => state.setExpenses)

      const { toast } = useToast()

      const current = row.original

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
    },
  },
]
