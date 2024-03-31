import { useEffect, useState, useTransition } from 'react'
import { getIncome } from '@/actions/income-actions'
import { Income } from '@/types'
import { formatDate } from '@/lib/date-format'

const useFetchIncome = () => {
  const [data, setData] = useState<Income[]>([])
  const [error, setError] = useState(null)
  const [loading, startTransition] = useTransition()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getIncome()

        if (res.error || !res.data) return

        const newIncomes: Income[] = res.data.map((income: Income) => ({
          ...income,
          created_at: formatDate(income.created_at),
          approved_at: income.approved_at
            ? formatDate(income.approved_at)
            : undefined,
          rejected_at: income.rejected_at
            ? formatDate(income.rejected_at)
            : undefined,
        }))

        setData(newIncomes as Income[])
      } catch (error: any) {
        console.error('Error fetching incomes: ', error)
        setError(error)
      }
    }

    startTransition(() => fetchData())
  }, [])

  return { data, error, loading }
}

export default useFetchIncome
