import { useEffect, useState, useTransition } from 'react'
import { getIncomeCategory } from '@/actions/income-category-actions'
import { Category } from '@/types'

const useFetchIncomeCategory = () => {
  const [data, setData] = useState<Category[]>([])
  const [error, setError] = useState(null)
  const [loading, startTransition] = useTransition()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getIncomeCategory()

        if (res.error || !res.data) return

        const newCategories: Category[] = res.data

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
