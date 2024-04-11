import { useEffect, useState, useTransition } from 'react'
import { getDonator } from '@/actions/donator-actions'
import { Donator } from '@/types'

const useFetchDonator = () => {
  const [data, setData] = useState<Donator[]>([])
  const [error, setError] = useState(null)
  const [loading, startTransition] = useTransition()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDonator()

        if (res.error || !res.data) return

        const newDonators = res.data

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
