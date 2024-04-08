'use client'

import { useEffect, useTransition } from 'react'

import { usePendingStore, useApprovedTransactionStore } from '@/stores'

import { getTransactions } from '@/actions/transaction-action'

import { columns } from './column'
import { DataTable } from './data-table'

const AdminApproved = () => {
  const transactions = useApprovedTransactionStore(
    (state) => state.transactions
  )
  const setTransactions = useApprovedTransactionStore(
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
            (transaction) => transaction.status.toLowerCase() === 'approved'
          )
        )
      } catch (error) {
        console.error('Error fetching transactions: ', error)
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

export default AdminApproved
