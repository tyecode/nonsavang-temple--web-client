import { useEffect, useState, useTransition } from 'react'
import { Donator } from '@/types'
import { formatDate } from '@/lib/date-format'
import { getDonator } from '@/actions/donator-actions'

const useFetchDonator = () => {
  const [data, setData] = useState<Donator[]>([])
  const [error, setError] = useState(null)
  const [loading, startTransition] = useTransition()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDonator()

        if (res.error || !res.data) return

        const newDonators = res.data.map((donator: Donator) => ({
          ...donator,
          created_at: formatDate(donator.created_at),
          updated_at: donator.updated_at
            ? formatDate(donator.updated_at)
            : undefined,
        }))

        setData(newDonators as Donator[])
      } catch (error: any) {
        console.error('Error fetching donators: ', error)
        setError(error)
      }
    }

    startTransition(() => fetchData())
  }, [])

  return { data, error, loading }
}

export default useFetchDonator
