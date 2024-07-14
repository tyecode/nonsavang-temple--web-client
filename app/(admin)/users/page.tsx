'use client'

import { useEffect, useTransition } from 'react'

import { useUserStore } from '@/stores/useUserStore'

import { columns } from './column'
import { DataTable } from './data-table'

const fetchUser = async () => {
  const res = await fetch('/users/api', {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
    cache: 'no-store',
  })

  if (!res.ok) return

  return await res.json()
}

export default function UsersPage() {
  const users = useUserStore((state) => state.users)
  const setUsers = useUserStore((state) => state.setUsers)

  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      const res = await fetchUser()

      setUsers(res.data)
    })
  }, [])

  return (
    <section className='container p-6'>
      <DataTable columns={columns} data={users} isPending={isPending} />
    </section>
  )
}
