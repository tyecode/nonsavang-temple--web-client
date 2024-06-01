'use client'

import Overview from '@/components/pages/overview'
import { useExpenseStore, useIncomeStore } from '@/stores'
import { useEffect, useTransition } from 'react'

const HomePage = () => {
  const setIncomes = useIncomeStore((state) => state.setIncomes)
  const setExpenses = useExpenseStore((state) => state.setExpenses)
  const [isPending, startTransition] = useTransition()

  const fetchIncome = async () => {
    const res = await fetch('/incomes/api', {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
      cache: 'no-store',
      next: {
        revalidate: 0,
      },
    })

    if (!res.ok) return

    const response = await res.json()

    setIncomes(response?.data)
  }

  const fetchExpense = async () => {
    const res = await fetch('/expenses/api', {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
      cache: 'no-store',
      next: {
        revalidate: 0,
      },
    })

    if (!res.ok) return

    const response = await res.json()

    setExpenses(response?.data)
  }

  useEffect(() => {
    startTransition(async () => {
      await Promise.all([fetchIncome(), fetchExpense()])
    })
  }, [])

  return (
    <div className='flex flex-grow'>
      <Overview isPending={isPending} />
    </div>
  )
}

export default HomePage
