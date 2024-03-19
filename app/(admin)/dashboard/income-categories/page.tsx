'use client'

import { useEffect } from 'react'

import { Category } from '@/types/category'

import { getIncomeCategory } from '@/actions/income-category-actions'

import { useIncomeCategoryStore, usePendingStore } from '@/stores'
import { CategoryState } from '@/stores/useIncomeCategoryStore'
import { PendingState } from '@/stores/usePendingStore'

import { formatDate } from '@/lib/date-format'

import { columns } from './column'
import { DataTable } from './data-table'

const AdminIncomeCategory = () => {
  const setPending = usePendingStore((state: PendingState) => state.setPending)
  const categories = useIncomeCategoryStore(
    (state: CategoryState) => state.categories
  )
  const setCategories = useIncomeCategoryStore(
    (state: CategoryState) => state.setCategories
  )

  useEffect(() => {
    const fetchData = async () => {
      setPending(true)

      try {
        const res = await getIncomeCategory()

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
        console.error('Error fetching income category', error)
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

export default AdminIncomeCategory
