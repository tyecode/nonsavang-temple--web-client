'use client'

import { useEffect } from 'react'

import { Income } from '@/types/income'

import { getIncome } from '@/actions/income-actions'

import { useIncomeStore, usePendingStore } from '@/stores'

import { formatDate } from '@/lib/date-format'

import { columns } from './column'
import { DataTable } from './data-table'

const AdminCurrencies = () => {
  const setPending = usePendingStore((state) => state.setPending)
  const incomes = useIncomeStore((state) => state.incomes)
  const setIncomes = useIncomeStore((state) => state.setIncomes)

  useEffect(() => {
    const fetchData = async () => {
      setPending(true)

      try {
        const res = await getIncome()

        if (res.error || !res.data) return

        const newIncomes: Income[] = res.data.map((income: Income) => ({
          ...income,
          created_at: formatDate(income.created_at),
          approved_at: income.approved_at
            ? formatDate(income.approved_at)
            : undefined,
          rejected_at: income.rejected_at
            ? formatDate(income.rejected_at)
            : undefined,
        }))

        setIncomes(newIncomes as Income[])
      } catch (error) {
        console.error('Error fetching incomes: ', error)
      } finally {
        setPending(false)
      }
    }
    fetchData()
  }, [setIncomes, setPending])

  return (
    <section className='container'>
      <DataTable columns={columns} data={incomes} />
    </section>
  )
}

export default AdminCurrencies
