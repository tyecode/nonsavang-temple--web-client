'use client'

import { useIncomeCategoryStore } from '@/stores'

import { columns } from './column'
import { DataTable } from './data-table'

const AdminIncomeCategory = () => {
  const categories = useIncomeCategoryStore((state) => state.categories)

  return (
    <section className='container py-6'>
      <DataTable columns={columns} data={categories} />
    </section>
  )
}

export default AdminIncomeCategory
