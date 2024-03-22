'use client'

import { useEffect } from 'react'

import { Expense } from '@/types/expense'

import { getExpense } from '@/actions/expense-actions'

import { usePendingStore, useExpenseStore } from '@/stores'

import { formatDate } from '@/lib/date-format'

import { DataTable } from './data-table'
import { columns } from './column'

const AdminCurrencies = () => {
  const setPending = usePendingStore((state) => state.setPending)
  const expenses = useExpenseStore((state) => state.expenses)
  const setExpenses = useExpenseStore((state) => state.setExpenses)

  useEffect(() => {
    const fetchData = async () => {
      setPending(true)

      try {
        const res = await getExpense()

        if (res.error || !res.data) return

        const newExpenses: Expense[] = res.data.map((expense: Expense) => ({
          ...expense,
          created_at: formatDate(expense.created_at),
          approved_at: expense.approved_at
            ? formatDate(expense.approved_at)
            : undefined,
          rejected_at: expense.rejected_at
            ? formatDate(expense.rejected_at)
            : undefined,
        }))

        setExpenses(newExpenses as Expense[])
      } catch (error) {
        console.error('Error fetching expenses: ', error)
      } finally {
        setPending(false)
      }
    }
    fetchData()
  }, [setExpenses, setPending])

  return (
    <section className='container'>
      <DataTable columns={columns} data={expenses} />
    </section>
  )
}

export default AdminCurrencies
