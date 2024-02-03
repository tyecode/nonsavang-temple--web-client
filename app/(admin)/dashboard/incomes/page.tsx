'use client'

import { useIncomesCategoryStore } from '@/stores/useIncomesCategoryStore'
import { Category, columns } from './column'
import { DataTable } from './data-table'

async function getData(): Promise<Category[]> {
  // Fetch data from your API here.
  return [
    {
      id: crypto.randomUUID(),
      name: 'Food',
      description: '',
    },
    {
      id: crypto.randomUUID(),
      name: 'Drink',
      description: '',
    },
  ]
}

export default function AdminIncomes() {
  // const data = await getData()
  const category = useIncomesCategoryStore((state) => state.category)

  return (
    <div className='container mx-auto'>
      <DataTable columns={columns} data={category} />
    </div>
  )
}
