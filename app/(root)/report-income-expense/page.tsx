// page.tsx
'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { useReactToPrint } from 'react-to-print'

import { Button } from '@/components/ui/button'
import { IncomeExpenseReport } from '@/components/pages/income-expense-report'
import { AccountSelector } from '@/components/account-selector'
import { CalendarDateRangePicker } from '@/components/date-range-picker'
import { Skeleton } from '@/components/ui/skeleton'

const fetchIncome = async () => {
  const res = await fetch('/incomes/api', {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
    cache: 'no-store',
  })

  if (!res.ok) return

  return await res.json()
}

const fetchExpense = async () => {
  const res = await fetch('/expenses/api', {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
    cache: 'no-store',
  })

  if (!res.ok) return

  return await res.json()
}

export default function ReportIncomeExpensePage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([])
  const [accountId, setAccountId] = useState<string>('')
  const [dateRange, setDateRange] = useState<any>(null)
  const [isPending, startTransition] = useTransition()

  const componentRef = useRef(null)

  const handlePrint = useReactToPrint({
    documentTitle: 'Income & Expense Report',
    content: () => componentRef.current!,
  })

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })

  const handleStateChange = (state: any) => {
    setDateRange(state)
  }

  const handleAccountChange = (newState: { id: string }) => {
    setAccountId(newState.id)
  }

  useEffect(() => {
    startTransition(async () => {
      const [incomes, expenses] = await Promise.all([
        fetchIncome(),
        fetchExpense(),
      ])

      const mergedTransitions = [
        ...(incomes.data || []),
        ...(expenses.data || []),
      ]
      const approvedTransactions = mergedTransitions.filter(
        (item) => item.status === 'APPROVED'
      )

      setTransactions(approvedTransactions)
    })
  }, [])

  useEffect(() => {
    const filterAndSortTransactions = () => {
      if (accountId === '' && !dateRange?.from && !dateRange?.to) {
        setFilteredTransactions([])
      } else {
        const accountTransactions = transactions
          .filter((item) => item.account_id === accountId)
          .filter((item) => {
            const createdAt = new Date(item.created_at).getTime()
            const from = new Date(dateRange?.from).getTime()
            const to = new Date(dateRange?.to).getTime()
            return createdAt >= from && createdAt <= to
          })
          .sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          )

        setFilteredTransactions(accountTransactions)
      }
    }
    filterAndSortTransactions()
  }, [accountId, transactions, dateRange])

  return (
    <div className='container space-y-4 py-6'>
      <div className='flex w-full justify-between text-end'>
        <div className='flex gap-2'>
          <AccountSelector onStateChange={handleAccountChange} />
        </div>
        <div className='flex gap-2'>
          <CalendarDateRangePicker onStateChange={handleStateChange} />
          <Button onClick={handlePrint}>Export</Button>
        </div>
      </div>
      <div ref={componentRef}>
        <div className='w-full text-center text-lg font-medium'>
          ວັດໂນນສະຫວ່າງ
        </div>
        <div className='w-full py-2 text-center text-2xl font-semibold'>
          ລາຍງານລາຍຮັບ-ລາຍຈ່າຍ
        </div>
        <div className='my-4 flex w-full justify-between'>
          <div className='flex flex-col gap-2 text-sm'>
            <div className='flex items-center gap-2'>
              <span>{`ເລກບັນຊີ:`}</span>
              <span className='font-medium'>
                {isPending ? (
                  <Skeleton className='h-4 w-80' />
                ) : filteredTransactions[0]?.account.id ? (
                  `${filteredTransactions[0]?.account.id}`
                ) : (
                  'N/A'
                )}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <span>{`ຊື່ບັນຊີ:`}</span>
              <span className='font-medium'>
                {isPending ? (
                  <Skeleton className='h-4 w-36' />
                ) : filteredTransactions[0]?.account.name ? (
                  `${filteredTransactions[0]?.account.name}`
                ) : (
                  'N/A'
                )}
              </span>
            </div>
          </div>
          <div className='flex gap-1 text-sm'>
            <div className='flex gap-2'>
              <div>{`ວັນທີ່:`}</div>
              <div className='flex gap-1 font-medium'>
                {!dateRange?.from || !dateRange?.to ? (
                  'ກະລຸນາເລືອກວັນທີ່'
                ) : (
                  <>
                    <span>{formatDate(dateRange?.from)}</span>
                    <span>{`-`}</span>
                    <span>{formatDate(dateRange?.to)}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <IncomeExpenseReport
          data={filteredTransactions}
          isPending={isPending}
        />
      </div>
    </div>
  )
}
