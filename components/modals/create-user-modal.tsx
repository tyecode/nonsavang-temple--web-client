'use client'

import { useState } from 'react'

import { createUser, getUser } from '@/actions/user-actions'
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

import LoadingButton from '@/components/buttons/loading-button'

import { useUserStore } from '@/stores/useUserStore'
import { User } from '@/types/user'

const CreateUserModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const updateUsers = useUserStore((state) => state.updateUsers)

  const { toast } = useToast()

  const handleCreateUser = async (formData: FormData) => {
    const email = String(formData.get('email'))
    const password = String(formData.get('password'))
    const first_name = String(formData.get('firstname'))
    const last_name = String(formData.get('lastname'))

    setLoading(true)

    try {
      const res = await createUser({ email, password, first_name, last_name })

      if (res.error) {
        toast({
          variant: 'destructive',
          description: 'ມີຂໍ້ຜິດພາດ! ເພີ່ມຂໍ້ມູນຜູ້ໃຊ້ໃໝ່ບໍ່ສຳເລັດ.',
        })
        return
      }

      toast({
        description: 'ເພີ່ມຂໍ້ມູນຜູ້ໃຊ້ໃໝ່ສຳເລັດແລ້ວ.',
      })
    } catch (error) {
      console.error('Failed to create user', error)
    }

    try {
      const res = await getUser()

      if (res.error || !res.data) {
        toast({
          description: res.message,
        })
        return
      }

      const newUsers = res.data.map((user: User) => ({
        ...user,
        created_at: formatDate(user.created_at),
      }))

      updateUsers(newUsers)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {isLoading ? (
          <LoadingButton>ເພິ່ມຂໍ້ມູນ</LoadingButton>
        ) : (
          <Button size={'sm'}>ເພິ່ມຂໍ້ມູນ</Button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>ເພິ່ມຂໍ້ມູນ</DialogTitle>
        </DialogHeader>
        <form action={handleCreateUser} className='grid gap-4 py-4'>
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
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              name='email'
              className='col-span-3'
              type='email'
              placeholder='youremail@example.com'
              required
            />
          </div>
          <div className='grid items-center gap-4'>
            <Label htmlFor='password'>Password</Label>
            <Input
              id='password'
              name='password'
              type='password'
              className='col-span-3'
              placeholder='Enter a secure password'
              minLength={8}
              required
            />
          </div>
          <div className='flex w-full justify-end'>
            <Button
              type='submit'
              size={'sm'}
              className='w-fit'
              onClick={() => setIsOpen(false)}
            >
              ເພິ່ມຂໍ້ມູນ
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateUserModal
