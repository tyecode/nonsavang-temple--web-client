'use client'

import { useEffect, useTransition } from 'react'
import { useAccountsStore } from '@/stores/useAccountsStore'
import { DataTable } from './data-table'
import { columns } from './column'
import { getAccounts } from '@/actions/accounts-actions'
import { toast } from '@/components/ui/use-toast'
import { usePendingStore } from '@/stores/usePendingStore'

const AdminAccounts = () => {
  const accounts = useAccountsStore((state) => state.accounts)
  const updateAccounts = useAccountsStore((state) => state.updateAccounts)
  const setPending = usePendingStore((state) => state.setPending)

  useEffect(() => {
    const fetchAccounts = async () => {
      setPending(true)

      await getAccounts().then((res) => {
        if (res.error) {
          console.log(res.error)

          return toast({
            description: res.message,
          })
        }

        updateAccounts(res.data)
        setPending(false)
      })
    }

    fetchAccounts()
  }, [updateAccounts, setPending])

  return (
    <section className='container'>
      <DataTable columns={columns} data={accounts} />
    </section>
  )
}

export default AdminAccounts
