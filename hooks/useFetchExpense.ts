import { useEffect, useState, useTransition } from 'react'
import { Expense } from '@/types'
import { formatDate } from '@/lib/date-format'
import { getExpense } from '@/actions/expense-actions'

const useFetchExpense = () => {
  const [data, setData] = useState<Expense[]>([])
  const [error, setError] = useState(null)
  const [loading, startTransition] = useTransition()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getExpense()

        if (res.error || !res.data) return

        const newExpenses: Expense[] = res.data.map((expense: Expense) => ({
          ...expense,
          created_at: formatDate(expense.created_at),
          approved_at: expense.approved_at
            ? formatDate(expense.approved_at)
            : undefined,
          rejected_at: expense.rejected_at
            ? formatDate(expense.rejected_at)
            : undefined,
        }))

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
