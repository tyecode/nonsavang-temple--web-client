'use client'

import { useEffect } from 'react'

import { Currency } from '@/types/currency'

import { getCurrency } from '@/actions/currency-actions'

import { usePendingStore, useCurrencyStore } from '@/stores'

import { formatDate } from '@/lib/date-format'

import { columns } from './column'
import { DataTable } from './data-table'

const AdminCurrencies = () => {
  const currencies = useCurrencyStore((state) => state.currencies)
  const setCurrencies = useCurrencyStore((state) => state.setCurrencies)
  const setPending = usePendingStore((state) => state.setPending)

  useEffect(() => {
    const fetchData = async () => {
      setPending(true)

      try {
        const res = await getCurrency()

        if (res.error || !res.data) return

        const newCurrencies: Currency[] = res.data.map(
          (currency: Currency) => ({
            ...currency,
            created_at: formatDate(currency.created_at),
            updated_at: currency.updated_at
              ? formatDate(currency.updated_at)
              : undefined,
          })
        )

        setCurrencies(newCurrencies as Currency[])
      } catch (error) {
        console.error('Error fetching currencies: ', error)
      } finally {
        setPending(false)
      }
    }
    fetchData()
  }, [setCurrencies, setPending])

  return (
    <section className='container'>
      <DataTable columns={columns} data={currencies} />
    </section>
  )
}

export default AdminCurrencies
