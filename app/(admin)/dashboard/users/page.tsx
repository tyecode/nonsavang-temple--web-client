'use client'

import { useUserStore } from '@/stores/useUserStore'

import { columns } from './column'
import { DataTable } from './data-table'

const UsersPage = () => {
  const users = useUserStore((state) => state.users)

  return (
    <section className='container'>
      <DataTable columns={columns} data={users} />
    </section>
  )
}

export default UsersPage
