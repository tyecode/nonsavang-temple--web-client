'use client'

import { useEffect } from 'react'

import { formatDate } from '@/lib/date-format'

import { Donator } from '@/types/donator'

import { getDonator } from '@/actions/donator-actions'

import { usePendingStore } from '@/stores/usePendingStore'
import { useDonatorStore } from '@/stores/useDonatorStore'

import { columns } from './column'
import { DataTable } from './data-table'

const DonatorsPage = () => {
  const setPending = usePendingStore((state) => state.setPending)
  const donators = useDonatorStore((state) => state.donators)
  const setDonators = useDonatorStore((state) => state.setDonators)

  useEffect(() => {
    const fetchData = async () => {
      setPending(true)

      try {
        const res = await getDonator()

        if (!res.data) {
          throw new Error(res.message)
        }

        const newDonators = res.data.map((donator: Donator) => ({
          ...donator,
          created_at: formatDate(donator.created_at),
          updated_at: donator.updated_at
            ? formatDate(donator.updated_at)
            : undefined,
        }))

        setDonators(newDonators)
      } catch (error) {
        console.error('Error fetching donators', error)
      } finally {
        setPending(false)
      }
    }

    fetchData()
  }, [setDonators, setPending])

  return (
    <section className='container'>
      <DataTable columns={columns} data={donators} />
    </section>
  )
}

export default DonatorsPage
