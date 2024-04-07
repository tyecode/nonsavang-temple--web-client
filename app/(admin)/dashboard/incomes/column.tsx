'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'

import { Income } from '@/types/income'

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

import { deleteIncome } from '@/actions/income-actions'

import { useIncomeStore } from '@/stores'

import { formatDate } from '@/lib/date-format'

export const columns: ColumnDef<Income>[] = [
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
    header: 'ປະເພດລາຍຮັບ',
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
    accessorKey: 'donator.display_name',
    header: 'ຜູ້ບໍລິຈາກ',
    cell: ({ row }) => {
      const donator = row.original.donator

      return donator ? (
        <span
          className='cursor-pointer'
          onClick={() => {
            navigator.clipboard.writeText(donator.id)
            toast({ description: 'ຄັດລອກໄອດີລົງໃນຄລິບບອດແລ້ວ' })
          }}
        >
          {donator.display_name}
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
    accessorKey: 'remark',
    header: 'ໝາຍເຫດ',
    cell: ({ row }) => {
      const current = row.original

      return current.remark ? current.remark : '--'
    },
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
      const incomes = useIncomeStore((state) => state.incomes)
      const setIncomes = useIncomeStore((state) => state.setIncomes)

      const { toast } = useToast()

      const current = row.original

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

          const newIncomes = incomes.filter(
            (income: Income) => income.id !== id
          )

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
              ລົບຂໍ້ມູນ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
