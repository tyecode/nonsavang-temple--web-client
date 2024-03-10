'use client'

import { useEffect } from 'react'

import { formatDate } from '@/lib/date-format'

import { useIncomeCategoryStore, usePendingStore } from '@/stores'

import { getIncomeCategory } from '@/actions/income-category-actions'

import { Category } from '@/types/category'

import { columns } from './column'
import { DataTable } from './data-table'

const AdminIncomeCategory = () => {
  const categories = useIncomeCategoryStore((state) => state.categories)
  const setCategories = useIncomeCategoryStore((state) => state.setCategories)
  const setPending = usePendingStore((state) => state.setPending)

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
