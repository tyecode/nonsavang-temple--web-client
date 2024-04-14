'use client'

import { useIncomeStore } from '@/stores'

import { columns } from './column'
import { DataTable } from './data-table'

const AdminCurrencies = () => {
  const incomes = useIncomeStore((state) => state.incomes)

  return (
    <section className='container py-6'>
      <DataTable columns={columns} data={incomes} />
    </section>
  )
}

export default AdminCurrencies
