'use client'

import { useCurrencyStore } from '@/stores'

import { columns } from './column'
import { DataTable } from './data-table'

const AdminCurrencies = () => {
  const currencies = useCurrencyStore((state) => state.currencies)

  return (
    <section className='container py-6'>
      <DataTable columns={columns} data={currencies} />
    </section>
  )
}

export default AdminCurrencies
