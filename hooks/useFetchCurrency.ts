import { useEffect, useState, useTransition } from 'react'
import { getCurrency } from '@/actions/currency-actions'
import { Currency } from '@/types'
import { formatDate } from '@/lib/date-format'

const useFetchCurrency = () => {
  const [data, setData] = useState<Currency[]>([])
  const [error, setError] = useState(null)
  const [loading, startTransition] = useTransition()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCurrency()

        if (res.error || !res.data) return

        const newCurrencies: Currency[] = res.data

        setData(newCurrencies as Currency[])
      } catch (error: any) {
        console.error('Error fetching currencies: ', error)
        setError(error)
      }
    }

    startTransition(() => fetchData())
  }, [])

  return { data, error, loading }
}

export default useFetchCurrency
