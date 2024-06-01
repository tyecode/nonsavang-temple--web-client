'use client'

import { useExpenseStore } from '@/stores'

import { DataTable } from './data-table'
import { columns } from './column'
import { useEffect, useTransition } from 'react'

const AdminCurrencies = () => {
  const expenses = useExpenseStore((state) => state.expenses)
  const setExpenses = useExpenseStore((state) => state.setExpenses)
  const [isPending, startTransition] = useTransition()

  const fetchExpenses = async () => {
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

    const expenses = await res.json()

    setExpenses(expenses?.data)
  }

  console.log(expenses)

  useEffect(() => {
    startTransition(async () => {
      await fetchExpenses()
    })
  }, [])

  return (
    <section className='container py-6'>
      <DataTable columns={columns} data={expenses} isPending={isPending} />
    </section>
  )
}

export default AdminCurrencies
