'use client'

import { useIncomeStore } from '@/stores'

import { columns } from './column'
import { DataTable } from './data-table'
import { useEffect, useTransition } from 'react'

const AdminCurrencies = () => {
  const incomes = useIncomeStore((state) => state.incomes)
  const setIncomes = useIncomeStore((state) => state.setIncomes)
  const [isPending, startTransition] = useTransition()

  const fetchIncomes = async () => {
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

    const incomes = await res.json()

    setIncomes(incomes?.data)
  }

  useEffect(() => {
    startTransition(async () => {
      await fetchIncomes()
    })
  }, [])

  return (
    <section className='container py-6'>
      <DataTable columns={columns} data={incomes} isPending={isPending} />
    </section>
  )
}

export default AdminCurrencies
