import { useEffect, useState, useTransition } from 'react'
import { getExpense } from '@/actions/expense-actions'
import { Expense } from '@/types'

const useFetchExpense = () => {
  const [data, setData] = useState<Expense[]>([])
  const [error, setError] = useState(null)
  const [loading, startTransition] = useTransition()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getExpense()

        if (res.error || !res.data) return

        const newExpenses: Expense[] = res.data

        setData(newExpenses as Expense[])
      } catch (error: any) {
        console.error('Error fetching expenses: ', error)
        setError(error)
      }
    }

    startTransition(() => fetchData())
  }, [])

  return { data, error, loading }
}

export default useFetchExpense
