'use client'

import { useExpenseStore } from '@/stores'

import { DataTable } from './data-table'
import { columns } from './column'

const AdminCurrencies = () => {
  const expenses = useExpenseStore((state) => state.expenses)

  return (
    <section className='container'>
      <DataTable columns={columns} data={expenses} />
    </section>
  )
}

export default AdminCurrencies
