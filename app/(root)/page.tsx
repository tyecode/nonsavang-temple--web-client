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
      next: {
        revalidate: 30,
      },
    })

    if (!res.ok) return

    const incomes = await res.json()

    setIncomes(incomes?.data)
  }

  const fetchExpense = async () => {
    const res = await fetch('/expenses/api', {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
      next: {
        revalidate: 30,
      },
    })

    if (!res.ok) return

    const expenses = await res.json()

    setExpenses(expenses?.data)
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
