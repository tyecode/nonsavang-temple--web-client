'use client'

import { useEffect } from 'react'

import { formatDate } from '@/lib/date-format'
import { getUser } from '@/actions/user-actions'

import { columns } from './column'
import { DataTable } from './data-table'

import { usePendingStore } from '@/stores/usePendingStore'
import { useUserStore } from '@/stores/useUserStore'

import { User } from '@/types/user'

const UsersPage = () => {
  const users = useUserStore((state) => state.users)
  const setUsers = useUserStore((state) => state.setUsers)
  const setPending = usePendingStore((state) => state.setPending)

  useEffect(() => {
    const fetchData = async () => {
      setPending(true)

      try {
        const res = await getUser()

        if (!res.data) {
          throw new Error(res.message)
        }

        const newUsers = res.data.map((user: User) => ({
          ...user,
          created_at: formatDate(user.created_at),
          updated_at: user.updated_at ? formatDate(user.updated_at) : undefined,
        }))

        setUsers(newUsers as User[])
      } catch (error) {
        console.error('Error fetching users: ', error)
      } finally {
        setPending(false)
      }
    }

    fetchData()
  }, [setPending, setUsers])

  return (
    <section className='container'>
      <DataTable columns={columns} data={users} />
    </section>
  )
}

export default UsersPage
