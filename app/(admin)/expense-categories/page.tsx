'use client'

import { useEffect, useTransition } from 'react'

import { useExpenseCategoryStore } from '@/stores'

import { columns } from './column'
import { DataTable } from './data-table'

const fetchExpenseCategory = async () => {
  const res = await fetch('/expense-categories/api', {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
    cache: 'no-store',
  })

  if (!res.ok) return

  return await res.json()
}

const AdminExpenseCategory = () => {
  const categories = useExpenseCategoryStore((state) => state.categories)
  const setCategories = useExpenseCategoryStore((state) => state.setCategories)

  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      const res = await fetchExpenseCategory()

      setCategories(res.data)
    })
  }, [])

  return (
    <section className='container py-6'>
      <DataTable columns={columns} data={categories} isPending={isPending} />
    </section>
  )
}

export default AdminExpenseCategory
