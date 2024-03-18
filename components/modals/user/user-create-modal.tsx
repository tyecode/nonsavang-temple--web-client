'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoadingButton } from '@/components/buttons'
import { useToast } from '@/components/ui/use-toast'

import { createUser, getUser } from '@/actions/user-actions'
import { User } from '@/types/user'
import { useUserStore } from '@/stores/useUserStore'

import { formatDate } from '@/lib/date-format'

const formSchema: any = z.object({
  first_name: z.string().min(1, {
    message: 'ກະລຸນາປ້ອນຊື່.',
  }),
  last_name: z.string().min(1, {
    message: 'ກະລຸນາປ້ອນນາມສະກຸນ.',
  }),
  email: z
    .string()
    .min(1, {
      message: 'ກະລຸນາປ້ອນອີເມວ.',
    })
    .email({
      message: 'ອີເມວບໍ່ຖືກຕ້ອງ.',
    }),
  password: z.string().min(8, {
    message: 'ລະຫັດຜ່ານຕ້ອງຢ່າງໜ້ອຍ 8 ຕົວອັກສອນ.',
  }),
})

const UserCreateModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, startTransition] = useTransition()

  const users = useUserStore((state) => state.users)
  const setUsers = useUserStore((state) => state.setUsers)

  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const { email, password, first_name, last_name } = values

      try {
        const res = await createUser({
          email,
          password,
          first_name,
          last_name,
        })

        if (res.error || !res.data) {
          toast({
            variant: 'destructive',
            description: 'ມີຂໍ້ຜິດພາດ! ເພີ່ມຂໍ້ມູນຜູ້ໃຊ້ໃໝ່ບໍ່ສຳເລັດ.',
          })
          return
        }

        const newUsers = [
          ...users,
          {
            id: res.data.id,
            first_name: res.data.user_metadata.first_name,
            last_name: res.data.user_metadata.last_name,
            email: res.data.email,
            role: 'USER',
            created_at: formatDate(res.data.created_at),
            updated_at: undefined,
          } as User,
        ]

        setUsers(newUsers)
        toast({
          description: 'ເພີ່ມຂໍ້ມູນຜູ້ໃຊ້ໃໝ່ສຳເລັດແລ້ວ.',
        })
      } catch (error) {
        console.error('Failed to create user', error)
      } finally {
        setIsOpen(false)
        form.reset()
      }
    })
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
          <DialogTitle>ເພິ່ມຂໍ້ມູນຜູ້ໃຊ້</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='grid gap-2 py-4'
          >
            <div className='flex gap-4'>
              <FormField
                control={form.control}
                name='first_name'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>ຊື່</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='last_name'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>ນາມສະກຸນ</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel>ອີເມວ</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel>ລະຫັດຜ່ານ</FormLabel>
                  <FormControl>
                    <Input type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='mt-2 flex w-full justify-end'>
              {!isLoading ? (
                <Button type='submit' size={'sm'} className='w-fit'>
                  ເພິ່ມຂໍ້ມູນ
                </Button>
              ) : (
                <LoadingButton>ເພິ່ມຂໍ້ມູນ</LoadingButton>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default UserCreateModal
