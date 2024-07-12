'use client'

import { useEffect, useTransition } from 'react'

import { useIncomeStore } from '@/stores'

import { columns } from './column'
import { DataTable } from './data-table'

const fetchIncomes = async () => {
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

const AdminCurrencies = () => {
  const incomes = useIncomeStore((state) => state.incomes)
  const setIncomes = useIncomeStore((state) => state.setIncomes)

  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      const res = await fetchIncomes()

      setIncomes(res.data)
    })
  }, [])

  return (
    <section className='container py-6'>
      <DataTable columns={columns} data={incomes} isPending={isPending} />
    </section>
  )
}

export default AdminCurrencies
