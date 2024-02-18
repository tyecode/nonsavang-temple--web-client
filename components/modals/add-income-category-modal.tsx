'use client'

import { useState } from 'react'
import { createUser, getUsers } from '@/actions/users-actions'
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
import { useIncomesCategoryStore } from '@/stores/useIncomesCategoryStore'

const AddIncomeCategoryModal = () => {
  const updateCategory = useIncomesCategoryStore(
    (state) => state.updateCategory
  )
  const getCategory = useIncomesCategoryStore((state) => state.category)
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const handleAction = async (formData: FormData) => {
    const name = String(formData.get('name'))
    const description = String(formData.get('description'))
    const object = {
      id: crypto.randomUUID(),
      name: name,
      description: description,
    }

    updateCategory([...getCategory, object])
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size={'sm'}>ເພິ່ມຂໍ້ມູນ</Button>
      </DialogTrigger>
      <DialogContent className='max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>ເພິ່ມຂໍ້ມູນປະເພດລາຍຮັບ</DialogTitle>
        </DialogHeader>
        <form
          action={handleAction}
          onSubmit={() => setIsOpen(false)}
          className='grid gap-4 py-4'
        >
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              ຊື່ປະເພດລາຍຮັບ
            </Label>
            <Input
              id='name'
              name='name'
              className='col-span-3'
              type='text'
              required
              autoComplete='off'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='description' className='text-right'>
              ຄຳອະທິບາຍ
            </Label>
            <Input
              id='description'
              name='description'
              type='text'
              className='col-span-3'
              autoComplete='off'
            />
          </div>
          <Button className='mt-4' type='submit' size={'sm'}>
            Create user
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddIncomeCategoryModal
