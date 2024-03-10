'use client'

import { useEffect } from 'react'

import { DataTable } from './data-table'
import { columns } from './column'

import { Account } from '@/types/account'

import { getAccount } from '@/actions/account-actions'

import { usePendingStore, useAccountStore } from '@/stores'

import { formatDate } from '@/lib/date-format'

const AdminAccounts = () => {
  const accounts = useAccountStore((state) => state.accounts)
  const setAccounts = useAccountStore((state) => state.setAccounts)
  const setPending = usePendingStore((state) => state.setPending)

  useEffect(() => {
    const fetchData = async () => {
      setPending(true)

      try {
        const res = await getAccount()

        if (res.error || !res.data) return

        const newAccounts: Account[] = res.data.map((account: Account) => ({
          ...account,
          created_at: formatDate(account.created_at),
          updated_at: account.updated_at
            ? formatDate(account.updated_at)
            : undefined,
        }))

        console.log('newAccounts', newAccounts)
        setAccounts(newAccounts)
      } catch (error) {
        console.error('Error fetching accounts', error)
      } finally {
        setPending(false)
      }
    }
    fetchData()
  }, [setAccounts, setPending])

  return (
    <section className='container'>
      <DataTable columns={columns} data={accounts} />
    </section>
  )
}

export default AdminAccounts
