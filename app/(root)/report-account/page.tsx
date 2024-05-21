'use client'

import { useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'

import { Button } from '@/components/ui/button'
import { getAccount } from '@/actions/account-actions'
import { AccountReport } from '@/pages/account-report'

const ReportDonatorPage = () => {
  const [accountData, setAccountData] = useState<any[]>([])

  const componentRef = useRef(null)

  const handlePrint = useReactToPrint({
    documentTitle: 'Donator Report',
    content: () => componentRef.current!,
  })

  const currencyData = [
    ...new Set(accountData.map((item) => JSON.stringify(item.currency))),
  ].map((item) => JSON.parse(item))

  useEffect(() => {
    const fetchData = async () => {
      const res = await getAccount()

      if (res.error || !res.data) return

      setAccountData(res.data)
    }

    if (accountData.length > 0) return

    fetchData()
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
        <AccountReport data={accountData} currency={currencyData} />
      </div>
    </div>
  )
}

export default ReportDonatorPage
