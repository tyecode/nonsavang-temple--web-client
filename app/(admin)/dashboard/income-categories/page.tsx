'use client'

import { useEffect } from 'react'

import { Category } from '@/types/category'

import { getIncomeCategory } from '@/actions/income-category-actions'

import { useIncomeCategoryStore, usePendingStore } from '@/stores'

import { formatDate } from '@/lib/date-format'

import { columns } from './column'
import { DataTable } from './data-table'

const AdminIncomeCategory = () => {
  const setPending = usePendingStore((state) => state.setPending)
  const categories = useIncomeCategoryStore((state) => state.categories)
  const setCategories = useIncomeCategoryStore((state) => state.setCategories)

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

        setCategories(newCategories as Category[])
      } catch (error) {
        console.error('Error fetching income categories: ', error)
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
