'use client'

import { useEffect, useTransition } from 'react'

import { useIncomeCategoryStore } from '@/stores'

import { columns } from './column'
import { DataTable } from './data-table'

const AdminIncomeCategory = () => {
  const categories = useIncomeCategoryStore((state) => state.categories)
  const setCategories = useIncomeCategoryStore((state) => state.setCategories)
  const [isPending, startTransition] = useTransition()

  const fetchCategories = async () => {
    const res = await fetch('/income-categories/api', {
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

export default AdminIncomeCategory
