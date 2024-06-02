'use client'

import { useEffect, useTransition } from 'react'

import { useExpenseStore } from '@/stores'

import { DataTable } from './data-table'
import { columns } from './column'

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

  return await res.json()
}

const AdminCurrencies = () => {
  const expenses = useExpenseStore((state) => state.expenses)
  const setExpenses = useExpenseStore((state) => state.setExpenses)

  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      const res = await fetchExpense()

      setExpenses(res.data)
    })
  }, [])

  return (
    <section className='container py-6'>
      <DataTable columns={columns} data={expenses} isPending={isPending} />
    </section>
  )
}

export default AdminCurrencies
