import { useEffect, useState, useTransition } from 'react'
import { Category } from '@/types'
import { formatDate } from '@/lib/date-format'
import { getExpenseCategory } from '@/actions/expense-category-actions'

const useFetchExpenseCategory = () => {
  const [data, setData] = useState<Category[]>([])
  const [error, setError] = useState(null)
  const [loading, startTransition] = useTransition()

  useEffect(() => {
    const fetchData = async () => {
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

        setData(newCategories as Category[])
      } catch (error: any) {
        console.error('Error fetching expense categories: ', error)
        setError(error)
      }
    }

    startTransition(() => fetchData())
  }, [])

  return { data, error, loading }
}

export default useFetchExpenseCategory
