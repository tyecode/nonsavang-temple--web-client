'use client'

import { useEffect, useTransition } from 'react'

import { useRejectedTransactionStore } from '@/stores'

import { columns } from './column'
import { DataTable } from './data-table'

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

export default function AdminRejected() {
  const [isPending, startTransition] = useTransition()

  const transactions = useRejectedTransactionStore(
    (state) => state.transactions
  )
  const setTransactions = useRejectedTransactionStore(
    (state) => state.setTransactions
  )

  useEffect(() => {
    startTransition(async () => {
      const [incomes, expenses] = await Promise.all([
        fetchIncome(),
        fetchExpense(),
      ])

      setTransactions(
        [...incomes.data, ...expenses.data].filter(
          (t) => t.status === 'REJECTED'
        )
      )
    })
  }, [])

  return (
    <section className='container py-6'>
      <DataTable columns={columns} data={transactions} isPending={isPending} />
    </section>
  )
}
