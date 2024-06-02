'use client'

import { useEffect, useTransition } from 'react'

import { useAccountStore } from '@/stores'

import { DataTable } from './data-table'
import { columns } from './column'

const fetchAccounts = async () => {
  const res = await fetch('/accounts/api', {
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

  return await res.json()
}

const AdminAccounts = () => {
  const accounts = useAccountStore((state) => state.accounts)
  const setAccounts = useAccountStore((state) => state.setAccounts)

  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      const res = await fetchAccounts()

      setAccounts(res.data)
    })
  }, [])

  return (
    <section className='container py-6'>
      <DataTable columns={columns} data={accounts} isPending={isPending} />
    </section>
  )
}

export default AdminAccounts
