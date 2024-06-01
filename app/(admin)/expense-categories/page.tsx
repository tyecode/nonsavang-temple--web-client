'use client'

import { useEffect, useTransition } from 'react'

import { useExpenseCategoryStore } from '@/stores'

import { columns } from './column'
import { DataTable } from './data-table'

const AdminExpenseCategory = () => {
  const categories = useExpenseCategoryStore((state) => state.categories)
  const setCategories = useExpenseCategoryStore((state) => state.setCategories)
  const [isPending, startTransition] = useTransition()

  const fetchCategories = async () => {
    const res = await fetch('/expense-categories/api', {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
      cache: 'no-store',
      next: {
        revalidate: 0,
      },
    })

    if (!res.ok) return

    const response = await res.json()
    setCategories(response?.data)
  }

  useEffect(() => {
    startTransition(async () => {
      await fetchCategories()
    })
  }, [])

  return (
    <section className='container py-6'>
      <DataTable columns={columns} data={categories} isPending={isPending} />
    </section>
  )
}

export default AdminExpenseCategory
