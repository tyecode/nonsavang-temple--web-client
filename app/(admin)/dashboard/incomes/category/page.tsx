'use client'

import { useIncomesCategoryStore } from '@/stores/useIncomesCategoryStore'
import { columns } from './column'
import { DataTable } from './data-table'
// import { getIncomesCategory } from '@/actions/income-category-actions'
import { useEffect } from 'react'

export default function AdminIncomesCategory() {
  // const data = await getData()
  const category = useIncomesCategoryStore((state) => state.category)
  const updateCategory = useIncomesCategoryStore(
    (state) => state.updateCategory
  )

  useEffect(() => {
    // getIncomesCategory().then((res) => updateCategory(res))
  }, [updateCategory])

  return (
    <div className='container mx-auto'>
      <DataTable columns={columns} data={category} />
    </div>
  )
}
