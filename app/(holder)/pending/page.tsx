'use client'

import { useEffect, useState, useTransition } from 'react'

import { getTransactions } from '@/actions/transaction-action'
import { useTransactionStore } from '@/stores/useTransactionStore'
import {
  usePendingStore,
  useApprovedTransactionStore,
  useRejectedTransactionStore,
} from '@/stores'

import { columns } from './column'
import { DataTable } from './data-table'
import { Transaction } from '@/types'

const AdminPending = () => {
  const transactions = useTransactionStore((state) => state.transactions)
  const setTransactions = useTransactionStore((state) => state.setTransactions)
  const setApprovedTransactions = useApprovedTransactionStore(
    (state) => state.setTransactions
  )
  const setRejectedTransactions = useRejectedTransactionStore(
    (state) => state.setTransactions
  )

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

    const response = await res.json()
    return response?.data
  }

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

    const response = await res.json()
    return response?.data
  }

  useEffect(() => {
    startTransition(async () => {
      const [incomes, expenses] = await Promise.all([
        fetchIncomes(),
        fetchExpenses(),
      ])

      setTransactions(
        [...incomes, ...expenses].filter((t) => t.status === 'PENDING')
      )
      setApprovedTransactions(
        [...incomes, ...expenses].filter((t) => t.status === 'APPROVED')
      )
      setRejectedTransactions(
        [...incomes, ...expenses].filter((t) => t.status === 'REJECTED')
      )
    })
  }, [])

  return (
    <section className='container py-6'>
      <DataTable columns={columns} data={transactions} isPending={isPending} />
    </section>
  )
}

export default AdminPending
