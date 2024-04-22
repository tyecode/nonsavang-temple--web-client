import { useEffect, useState, useTransition } from 'react'
import { getUser } from '@/actions/user-actions'
import { User } from '@/types'

const useFetchUser = () => {
  const [data, setData] = useState<User[]>([])
  const [error, setError] = useState(null)
  const [loading, startTransition] = useTransition()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getUser()

        if (!res.data) return

        const newUsers = res.data

        setData(newUsers as User[])
      } catch (error: any) {
        console.error('Error fetching users: ', error)
        setError(error)
      }
    }

    startTransition(() => fetchData())
  }, [])

  return { data, error, loading }
}

export default useFetchUser
