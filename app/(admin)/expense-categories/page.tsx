'use client'

import { useExpenseCategoryStore } from '@/stores'

import { columns } from './column'
import { DataTable } from './data-table'

const AdminExpenseCategory = () => {
  const categories = useExpenseCategoryStore((state) => state.categories)

  return (
    <section className='container py-6'>
      <DataTable columns={columns} data={categories} />
    </section>
  )
}

export default AdminExpenseCategory
