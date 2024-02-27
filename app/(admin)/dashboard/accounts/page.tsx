'use client'

import { useEffect, useTransition } from 'react'
// import { useAccountsStore } from '@/stores/useAccountsStore'
import { DataTable } from './data-table'
import { columns } from './column'
import {
  createAccount,
  deleteAccount,
  getAccount,
  updateAccount,
} from '@/actions/account-actions'
import { toast } from '@/components/ui/use-toast'
import { usePendingStore } from '@/stores/usePendingStore'
import { AccountCreationData, AccountModificationData } from '@/types/account'
import { Button } from '@/components/ui/button'

const AdminAccounts = () => {
  // const accounts = useAccountsStore((state) => state.accounts)
  // const updateAccounts = useAccountsStore((state) => state.updateAccounts)
  const setPending = usePendingStore((state) => state.setPending)

  const handle = async () => {
    const object: AccountCreationData = {
      user_id: '5deec04b-928c-4934-a4ae-bfcbae5d3827',
      name: 'Test Account',
      balance: 1000000,
      currency_id: 'cef11010-d3c6-4b5b-9599-9e023878ea6f',
      remark: 'Test remark',
    }

    const { data, error, message } = await deleteAccount(
      '007d09a2-e990-402a-a00c-c706f2d5543e'
    )

    console.log(data, error, message)
  }

  return (
    <section className='container'>
      <Button onClick={handle}>Click</Button>
    </section>
  )
}

export default AdminAccounts
