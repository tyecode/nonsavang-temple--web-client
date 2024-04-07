import { useEffect, useState, useTransition } from 'react'
import { getAccount } from '@/actions/account-actions'
import { Account } from '@/types'

const useFetchAccount = () => {
  const [data, setData] = useState<Account[]>([])
  const [error, setError] = useState(null)
  const [loading, startTransition] = useTransition()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAccount()

        if (res.error || !res.data) return

        const newAccounts: Account[] = res.data

        setData(newAccounts as Account[])
      } catch (error: any) {
        console.error('Error fetching accounts: ', error)
        setError(error)
      }
    }

    startTransition(() => fetchData())
  }, [])

  return { data, error, loading }
}

export default useFetchAccount
