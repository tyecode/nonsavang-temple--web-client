'use client'

import { useEffect, useTransition } from 'react'

import { useTransactionStore } from '@/stores/useTransactionStore'
import {
  useApprovedTransactionStore,
  useRejectedTransactionStore,
} from '@/stores'

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

export default function AdminPending() {
  const transactions = useTransactionStore((state) => state.transactions)
  const setTransactions = useTransactionStore((state) => state.setTransactions)
  const setApprovedTransactions = useApprovedTransactionStore(
    (state) => state.setTransactions
  )
  const setRejectedTransactions = useRejectedTransactionStore(
    (state) => state.setTransactions
  )

  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      const [incomes, expenses] = await Promise.all([
        fetchIncome(),
        fetchExpense(),
      ])

      setTransactions(
        [...incomes.data, ...expenses.data].filter(
          (t) => t.status === 'PENDING'
        )
      )
      setApprovedTransactions(
        [...incomes.data, ...expenses.data].filter(
          (t) => t.status === 'APPROVED'
        )
      )
      setRejectedTransactions(
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
