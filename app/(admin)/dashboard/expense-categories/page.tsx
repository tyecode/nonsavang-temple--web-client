'use client'

import { useEffect } from 'react'

import { usePendingStore } from '@/stores'
import { formatDate } from '@/lib/date-format'

import { columns } from './column'
import { DataTable } from './data-table'
import { useExpenseCategoryStore } from '@/stores/useExpenseCategoryStore'
import { getExpenseCategory } from '@/actions/expense-category-actions'
import { Category } from '@/types/category'

const AdminExpenseCategory = () => {
  const categories = useExpenseCategoryStore((state) => state.categories)
  const setCategories = useExpenseCategoryStore((state) => state.setCategories)
  const setPending = usePendingStore((state) => state.setPending)

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

        setCategories(newCategories)
      } catch (error) {
        console.error('Error fetching expense category', error)
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
