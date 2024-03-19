'use client'

import { useEffect } from 'react'

import { Account } from '@/types/account'

import { getAccount } from '@/actions/account-actions'

import { usePendingStore, useAccountStore } from '@/stores'
import { AccountState } from '@/stores/useAccountStore'
import { PendingState } from '@/stores/usePendingStore'

import { formatDate } from '@/lib/date-format'

import { DataTable } from './data-table'
import { columns } from './column'

const AdminAccounts = () => {
  const accounts = useAccountStore((state: AccountState) => state.accounts)
  const setAccounts = useAccountStore(
    (state: AccountState) => state.setAccounts
  )
  const setPending = usePendingStore((state: PendingState) => state.setPending)

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
