'use client'

import { useEffect } from 'react'

import { Category } from '@/types/category'

import { getExpenseCategory } from '@/actions/expense-category-actions'

import { usePendingStore, useExpenseCategoryStore } from '@/stores'

import { formatDate } from '@/lib/date-format'

import { columns } from './column'
import { DataTable } from './data-table'

const AdminExpenseCategory = () => {
  const setPending = usePendingStore((state) => state.setPending)
  const categories = useExpenseCategoryStore((state) => state.categories)
  const setCategories = useExpenseCategoryStore((state) => state.setCategories)

  useEffect(() => {
    const fetchData = async () => {
      setPending(true)

      try {
        const res = await getExpenseCategory()

        if (res.error || !res.data) return

        const newCategories: Category[] = res.data.map(
          (category: Category) => ({
            ...category,
            created_at: formatDate(category.created_at),
            updated_at: category.updated_at
              ? formatDate(category.updated_at)
              : undefined,
          })
        )

        setCategories(newCategories as Category[])
      } catch (error) {
        console.error('Error fetching expense categories: ', error)
      } finally {
        setPending(false)
      }
    }
    fetchData()
  }, [setCategories, setPending])

  return (
    <section className='container'>
      <DataTable columns={columns} data={categories} />
    </section>
  )
}

export default AdminExpenseCategory
