'use client'

import { useState } from 'react'
import { Accounts, Users } from '@prisma/client'
import { createUsers, getUsers } from '@/actions/users-actions'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useAccountsStore } from '@/stores/useAccountsStore'
import { Textarea } from '../ui/textarea'
import { CurrencyCombo } from '../combos/currency-combo'
import { useCurrencyStore } from '@/stores/useCurrencyStore'

const AddAccountModal = () => {
  const updateAccounts = useAccountsStore((state) => state.updateAccounts)
  const getAccounts = useAccountsStore((state) => state.accounts)
  const currency = useCurrencyStore((state) => state.currency)

  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const handleCreateAccount = async (formData: FormData) => {
    const name = String(formData.get('name'))
    const balance = String(formData.get('balance'))
    const remark = String(formData.get('remark'))

    const newAccounts: Accounts = {
      id: '',
      name: name,
      balance: balance,
      currency: currency,
      remark: remark,
    }

    updateAccounts([...getAccounts, newAccounts])

    return toast({
      description: 'Create new Account successful',
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size={'sm'}>Add Account</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add Account</DialogTitle>
        </DialogHeader>
        <form
          action={handleCreateAccount}
          onSubmit={() => setIsOpen(false)}
          className='grid gap-4 py-4'
        >
          <div className='grid grid-cols-4 items-center gap-4'>
            <Input
              id='name'
              name='name'
              className='col-span-3'
              type='name'
              required
              placeholder='Name'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Input
              id='balance'
              name='balance'
              type='balance'
              className='col-span-3'
              required
              placeholder='Balance'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='currency' className='text-right'>
              Currency
            </Label>
            {/* <Input
              id='currency'
              name='currency'
              type='currency'
              className='col-span-3'
              required
            /> */}
            <CurrencyCombo />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Textarea
              id='remark'
              name='remark'
              className='w-[277px] resize-none'
            />
          </div>
          <Button className='mt-8' type='submit' size={'sm'}>
            Create Account
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddAccountModal
