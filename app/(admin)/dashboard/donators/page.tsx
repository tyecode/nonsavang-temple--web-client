'use client'

import { useEffect } from 'react'

import { Donator } from '@/types/donator'

import { getDonator } from '@/actions/donator-actions'

import { usePendingStore, useDonatorStore } from '@/stores'

import { formatDate } from '@/lib/date-format'

import { DataTable } from './data-table'
import { columns } from './column'

const DonatorsPage = () => {
  const setPending = usePendingStore((state) => state.setPending)
  const setDonators = useDonatorStore((state) => state.setDonators)
  const donators = useDonatorStore((state) => state.donators)

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

        setDonators(newDonators as Donator[])
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
