'use client'

import { useEffect, useTransition } from 'react'

import { useIncomeCategoryStore } from '@/stores'

import { columns } from './column'
import { DataTable } from './data-table'

const fetchIncomeCategory = async () => {
  const res = await fetch('/income-categories/api', {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
    cache: 'no-store',
  })

  if (!res.ok) return

  return await res.json()
}

export default function AdminIncomeCategory() {
  const categories = useIncomeCategoryStore((state) => state.categories)
  const setCategories = useIncomeCategoryStore((state) => state.setCategories)

  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      const res = await fetchIncomeCategory()

      setCategories(res.data)
    })
  }, [])

  return (
    <section className='container py-6'>
      <DataTable columns={columns} data={categories} isPending={isPending} />
    </section>
  )
}
