'use client'

import { useDonatorStore } from '@/stores'

import { DataTable } from './data-table'
import { columns } from './column'

const DonatorsPage = () => {
  const donators = useDonatorStore((state) => state.donators)

  return (
    <section className='container py-6'>
      <DataTable columns={columns} data={donators} />
    </section>
  )
}

export default DonatorsPage
