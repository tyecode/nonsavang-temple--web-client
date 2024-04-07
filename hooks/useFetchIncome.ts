import { useEffect, useState, useTransition } from 'react'
import { getIncome } from '@/actions/income-actions'
import { Income } from '@/types'

const useFetchIncome = () => {
  const [data, setData] = useState<Income[]>([])
  const [error, setError] = useState(null)
  const [loading, startTransition] = useTransition()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getIncome()

        if (res.error || !res.data) return

        const newIncomes: Income[] = res.data

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
