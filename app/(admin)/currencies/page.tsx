'use client'

import { useEffect, useTransition } from 'react'

import { useCurrencyStore } from '@/stores'

import { columns } from './column'
import { DataTable } from './data-table'

const AdminCurrencies = () => {
  const currencies = useCurrencyStore((state) => state.currencies)
  const setCurrencies = useCurrencyStore((state) => state.setCurrencies)
  const [isPending, startTransition] = useTransition()

  const fetchAccounts = async () => {
    const res = await fetch('/currencies/api', {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
      cache: 'no-store',
      next: {
        revalidate: 0,
      },
    })

    if (!res.ok) return

    const response = await res.json()
    setCurrencies(response?.data)
  }

  useEffect(() => {
    startTransition(async () => {
      await fetchAccounts()
    })
  }, [])

  return (
    <section className='container py-6'>
      <DataTable columns={columns} data={currencies} isPending={isPending} />
    </section>
  )
}

export default AdminCurrencies
