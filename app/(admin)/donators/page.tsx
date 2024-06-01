'use client'

import { useEffect, useTransition } from 'react'

import { useDonatorStore } from '@/stores'

import { DataTable } from './data-table'
import { columns } from './column'

const DonatorsPage = () => {
  const donators = useDonatorStore((state) => state.donators)
  const setDonators = useDonatorStore((state) => state.setDonators)
  const [isPending, startTransition] = useTransition()

  const fetchDonators = async () => {
    const res = await fetch('/donators/api', {
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
    setDonators(response?.data)
  }

  useEffect(() => {
    startTransition(async () => {
      await fetchDonators()
    })
  }, [])

  return (
    <section className='container py-6'>
      <DataTable columns={columns} data={donators} isPending={isPending} />
    </section>
  )
}

export default DonatorsPage
