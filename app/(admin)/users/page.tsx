'use client'

import { useEffect, useTransition } from 'react'

import { useUserStore } from '@/stores/useUserStore'

import { columns } from './column'
import { DataTable } from './data-table'

const UsersPage = () => {
  const users = useUserStore((state) => state.users)
  const setUsers = useUserStore((state) => state.setUsers)
  const [isPending, startTransition] = useTransition()

  const fetchUsers = async () => {
    const res = await fetch('/users/api', {
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
    setUsers(response?.data)
  }

  useEffect(() => {
    startTransition(async () => {
      await fetchUsers()
    })
  }, [])

  return (
    <section className='container p-6'>
      <DataTable columns={columns} data={users} isPending={isPending} />
    </section>
  )
}

export default UsersPage
