'use client'

import { useEffect, useTransition } from 'react'

import { getTransactions } from '@/actions/transaction-action'
import { useTransactionStore } from '@/stores/useTransactionStore'
import {
  usePendingStore,
  useApprovedTransactionStore,
  useRejectedTransactionStore,
} from '@/stores'

import { columns } from './column'
import { DataTable } from './data-table'

const AdminPending = () => {
  const transactions = useTransactionStore((state) => state.transactions)
  const setTransactions = useTransactionStore((state) => state.setTransactions)
  const setApprovedTransactions = useApprovedTransactionStore(
    (state) => state.setTransactions
  )
  const setRejectedTransactions = useRejectedTransactionStore(
    (state) => state.setTransactions
  )

  const setPending = usePendingStore((state) => state.setPending)

  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTransactions()

        if (res?.error || !res?.data) return

        setTransactions(
          res.data.filter(
            (transaction) => transaction.status.toLowerCase() === 'pending'
          )
        )
        setApprovedTransactions(
          res.data.filter(
            (transaction) => transaction.status.toLowerCase() === 'approved'
          )
        )
        setRejectedTransactions(
          res.data.filter(
            (transaction) => transaction.status.toLowerCase() === 'rejected'
          )
        )
      } catch (error) {
        console.error('Error fetching transactions', error)
      }
    }

    if (transactions.length > 0) return

    startTransition(() => fetchData())
  }, [])

  useEffect(() => {
    setPending(isPending)
  }, [isPending])

  return (
    <section className='container py-6'>
      <DataTable columns={columns} data={transactions} />
    </section>
  )
}

export default AdminPending
