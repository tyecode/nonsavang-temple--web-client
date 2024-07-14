'use client'

import { useEffect, useTransition } from 'react'

import { useCurrencyStore } from '@/stores'

import { columns } from './column'
import { DataTable } from './data-table'

const fetchCurrency = async () => {
  const res = await fetch('/currencies/api', {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
    cache: 'no-store',
  })

  if (!res.ok) return

  return await res.json()
}

export default function AdminCurrencies() {
  const currencies = useCurrencyStore((state) => state.currencies)
  const setCurrencies = useCurrencyStore((state) => state.setCurrencies)

  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      const res = await fetchCurrency()

      setCurrencies(res.data)
    })
  }, [])

  return (
    <section className='container py-6'>
      <DataTable columns={columns} data={currencies} isPending={isPending} />
    </section>
  )
}
