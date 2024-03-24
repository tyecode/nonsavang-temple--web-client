import { useEffect, useState, useTransition } from 'react'
import { getUser } from '@/actions/user-actions'
import { User } from '@/types'
import { formatDate } from '@/lib/date-format'

const useFetchUser = () => {
  const [data, setData] = useState<User[]>([])
  const [error, setError] = useState(null)
  const [loading, startTransition] = useTransition()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getUser()

        if (!res.data) {
          throw new Error(res.message)
        }

        const newUsers = res.data.map((user: User) => ({
          ...user,
          created_at: formatDate(user.created_at),
          updated_at: user.updated_at ? formatDate(user.updated_at) : undefined,
        }))

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
