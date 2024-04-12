import { useEffect, useState, useTransition } from 'react'
import { getExpenseCategory } from '@/actions/expense-category-actions'
import { Category } from '@/types'

const useFetchExpenseCategory = () => {
  const [data, setData] = useState<Category[]>([])
  const [error, setError] = useState(null)
  const [loading, startTransition] = useTransition()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getExpenseCategory()

        if (res.error || !res.data) return

        const newCategories: Category[] = res.data

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
