'use client'

import { useEffect, useRef, useTransition } from 'react'
import { useReactToPrint } from 'react-to-print'

import { Button } from '@/components/ui/button'
import { AccountReport } from '@/components/pages/account-report'
import { useAccountStore } from '@/stores'

const fetchAccounts = async () => {
  const res = await fetch('/accounts/api', {
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

  return await res.json()
}

const ReportDonatorPage = () => {
  const setAccounts = useAccountStore((state) => state.setAccounts)
  const accounts = useAccountStore((state) => state.accounts)
  const [isPending, startTransition] = useTransition()

  const componentRef = useRef(null)

  const handlePrint = useReactToPrint({
    documentTitle: 'Donator Report',
    content: () => componentRef.current!,
  })

  const currencyData = [
    ...new Set(accounts.map((item) => JSON.stringify(item.currency))),
  ].map((item) => JSON.parse(item))

  useEffect(() => {
    startTransition(async () => {
      const res = await fetchAccounts()

      setAccounts(res.data)
    })
  }, [])

  return (
    <div className='container space-y-4 py-6'>
      <div className='flex w-full justify-between text-end'>
        <div className='flex gap-2'></div>
        <div className='flex gap-2'>
          <Button onClick={handlePrint}>Export</Button>
        </div>
      </div>
      <div ref={componentRef}>
        <div className='w-full text-center text-lg font-medium'>
          ວັດໂນນສະຫວ່າງ
        </div>
        <div className='w-full py-2 text-center text-2xl font-semibold'>
          ລາຍງານບັນຊີທັງໝົດ
        </div>
        <div className='mt-4 flex w-full justify-between'>
          <div className='flex gap-1 text-sm'></div>
        </div>
        <AccountReport
          data={accounts}
          currency={currencyData}
          isPending={isPending}
        />
      </div>
    </div>
  )
}

export default ReportDonatorPage
