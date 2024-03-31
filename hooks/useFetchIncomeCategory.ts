import { useEffect, useState, useTransition } from 'react'
import { Category } from '@/types'
import { formatDate } from '@/lib/date-format'
import { getIncomeCategory } from '@/actions/income-category-actions'

const useFetchIncomeCategory = () => {
  const [data, setData] = useState<Category[]>([])
  const [error, setError] = useState(null)
  const [loading, startTransition] = useTransition()

  useEffect(() => {
    const fetchData = async () => {
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

        setData(newCategories as Category[])
      } catch (error: any) {
        console.error('Error fetching income categories: ', error)
        setError(error)
      }
    }

    startTransition(() => fetchData())
  }, [])

  return { data, error, loading }
}

export default useFetchIncomeCategory
