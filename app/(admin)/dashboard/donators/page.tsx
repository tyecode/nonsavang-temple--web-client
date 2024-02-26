'use client'

import { useEffect } from 'react'

import { formatDate } from '@/lib/date-format'
import { getDonator } from '@/actions/donator-actions'

import { columns } from './column'
import { DataTable } from './data-table'

import { usePendingStore } from '@/stores/usePendingStore'
import { useDonatorStore } from '@/stores/useDonatorStore'

import { Donator } from '@/types/donator'

const DonatorsPage = () => {
  const donators = useDonatorStore((state) => state.donators)
  const updateDonators = useDonatorStore((state) => state.updateDonators)
  const setPending = usePendingStore((state) => state.setPending)

  useEffect(() => {
    const fetchData = async () => {
      setPending(true)

      try {
        const res = await getDonator()

        if (!res.data) {
          throw new Error(res.message)
        }

        const newUsers = res.data.map((donator: Donator) => ({
          ...donator,
          created_at: formatDate(donator.created_at),
          updated_at: donator.updated_at
            ? formatDate(donator.updated_at)
            : undefined,
        }))

        updateDonators(newUsers)
      } catch (error) {
        console.error('Error fetching donators', error)
      } finally {
        setPending(false)
      }
    }

    fetchData()
  }, [updateDonators, setPending])

  return (
    <section className='container'>
      <DataTable columns={columns} data={donators} />
    </section>
  )
}

export default DonatorsPage
