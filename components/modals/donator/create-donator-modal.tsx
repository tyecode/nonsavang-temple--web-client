'use client'

import { useState, useTransition } from 'react'

import { formatDate } from '@/lib/date-format'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'

import { LoadingButton } from '@/components/buttons'

import { useDonatorStore } from '@/stores/useDonatorStore'
import { createDonator } from '@/actions/donator-actions'
import { Donator } from '@/types/donator'
import { Textarea } from '@/components/ui/textarea'

const CreateDonatorModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const currentDonators = useDonatorStore((state) => state.donators)
  const updateDonators = useDonatorStore((state) => state.updateDonators)

  const { toast } = useToast()

  const handleCreateDonator = async (formData: FormData) => {
    const first_name = String(formData.get('firstname'))
    const last_name = String(formData.get('lastname'))
    const address = String(formData.get('address'))

    startTransition(async () => {
      try {
        const res = await createDonator({ first_name, last_name, address })

        if (res.error || !res.data) {
          toast({
            description: 'ມີຂໍ້ຜິດພາດ! ເພີ່ມຂໍ້ມູນຜູ້ບໍລິຈາກບໍ່ສຳເລັດ.',
          })
          return
        }

        toast({
          description: 'ເພີ່ມຂໍ້ມູນຜູ້ບໍລິຈາກສຳເລັດແລ້ວ.',
        })

        const newDonators: Donator[] = [
          ...currentDonators,
          ...res.data.map((item) => ({
            ...item,
            created_at: formatDate(item.created_at),
          })),
        ]

        updateDonators(newDonators)
      } catch (error) {
        console.error('Error creating donator:', error)
      } finally {
        setIsOpen(false)
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {!isPending ? (
          <Button size={'sm'}>ເພິ່ມຂໍ້ມູນ</Button>
        ) : (
          <LoadingButton>ເພິ່ມຂໍ້ມູນ</LoadingButton>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>ເພີ່ມຂໍ້ມູນຜູ້ບໍລິຈາກ</DialogTitle>
        </DialogHeader>
        <form action={handleCreateDonator} className='grid gap-4 py-4'>
          <div className='grid items-center gap-4'>
            <Label htmlFor='firstname'>Firstname</Label>
            <Input
              id='firstname'
              name='firstname'
              className='col-span-3'
              type='text'
              placeholder='Enter your first name'
              required
            />
          </div>
          <div className='grid items-center gap-4'>
            <Label htmlFor='lastname'>Lastname</Label>
            <Input
              id='lastname'
              name='lastname'
              className='col-span-3'
              type='text'
              placeholder='Enter your last name'
              required
            />
          </div>
          <div className='grid items-center gap-4'>
            <Label htmlFor='lastname'>Address</Label>
            <Textarea
              id='address'
              name='address'
              className='col-span-3'
              placeholder='Enter your address'
            />
          </div>
          <div className='flex w-full justify-end'>
            {!isPending ? (
              <Button type='submit' size={'sm'} className='w-fit'>
                ເພິ່ມຂໍ້ມູນ
              </Button>
            ) : (
              <LoadingButton>ເພິ່ມຂໍ້ມູນ</LoadingButton>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateDonatorModal
