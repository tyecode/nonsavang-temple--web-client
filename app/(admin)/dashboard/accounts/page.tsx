'use client'

import { useAccountStore } from '@/stores'

import { DataTable } from './data-table'
import { columns } from './column'

const AdminAccounts = () => {
  const accounts = useAccountStore((state) => state.accounts)

  return (
    <section className='container'>
      <DataTable columns={columns} data={accounts} />
    </section>
  )
}

export default AdminAccounts
