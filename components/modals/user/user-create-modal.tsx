'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

import { User } from '@/types/user'

import { createUser } from '@/actions/user-actions'

import { UserState, useUserStore } from '@/stores/useUserStore'

import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandItem } from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { LoadingButton } from '@/components/buttons'
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import { USER_TITLES } from '@/constants/title-name'
import { userCreateSchema } from '@/app/(admin)/users/schema'

const UserCreateModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isShow, setIsShow] = useState(false)
  const [openTitle, setOpenTitle] = useState(false)

  const [isPending, startTransition] = useTransition()

  const users = useUserStore((state: UserState) => state.users)
  const setUsers = useUserStore((state: UserState) => state.setUsers)

  const { toast } = useToast()

  const form = useForm<z.infer<typeof userCreateSchema>>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      title: 'ພຣະ',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof userCreateSchema>) => {
    startTransition(async () => {
      try {
        const res = await createUser(values)

        if (res.error || !res.data) {
          toast({
            variant: 'destructive',
            description: 'ມີຂໍ້ຜິດພາດ! ເພີ່ມຂໍ້ມູນຜູ້ໃຊ້ໃໝ່ບໍ່ສຳເລັດ.',
          })
          return
        }

        const newUsers = [...users, ...res.data]

        setUsers(newUsers as User[])
        toast({
          description: 'ເພີ່ມຂໍ້ມູນຜູ້ໃຊ້ໃໝ່ສຳເລັດແລ້ວ.',
        })
      } catch (error) {
        console.error('Failed to create user: ', error)
      } finally {
        setIsOpen(false)
        form.reset()
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {isPending ? (
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
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel className='pointer-events-none my-[5px]'>
                    ຄຳນຳໜ້າ
                  </FormLabel>
                  <Popover open={openTitle} onOpenChange={setOpenTitle}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          disabled={isPending}
                          variant='outline'
                          role='combobox'
                          aria-expanded={openTitle}
                          className='w-full justify-between'
                        >
                          {field.value
                            ? USER_TITLES.find(
                                (option: { id: number; title: string }) =>
                                  option.title === field.value
                              )?.title
                            : 'ເລືອກຄຳນຳໜ້າ...'}
                          <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <FormMessage />
                    <PopoverContent className='w-[375px] p-0'>
                      <Command>
                        <CommandGroup className='max-h-[200px] overflow-y-scroll'>
                          {USER_TITLES.map(
                            (option: { id: number; title: string }) => (
                              <CommandItem
                                key={option.id}
                                value={option.title}
                                onSelect={() => {
                                  field.onChange(option.title)
                                  setOpenTitle(false)
                                }}
                              >
                                {option.title}
                                <CheckIcon
                                  className={cn(
                                    'ml-auto h-4 w-4',
                                    field.value === option.title
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                              </CommandItem>
                            )
                          )}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            <div className='flex gap-4'>
              <FormField
                control={form.control}
                name='first_name'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel className='pointer-events-none'>ຊື່</FormLabel>
                    <FormControl>
                      <Input disabled={isPending} {...field} />
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
                    <FormLabel className='pointer-events-none'>
                      ນາມສະກຸນ
                    </FormLabel>
                    <FormControl>
                      <Input disabled={isPending} {...field} />
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
                  <FormLabel className='pointer-events-none'>ອີເມວ</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='group relative flex-1'>
                  <FormLabel className='pointer-events-none'>
                    ລະຫັດຜ່ານ
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      type={isShow ? 'text' : 'password'}
                      className='pr-12'
                      {...field}
                    />
                  </FormControl>
                  <span className='absolute right-4 top-8 cursor-pointer opacity-0 duration-200 group-hover:opacity-100'>
                    {isShow ? (
                      <FontAwesomeIcon
                        icon={faEye}
                        width={20}
                        height={20}
                        className='text-foreground/50'
                        onClick={() => setIsShow(!isShow)}
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faEyeSlash}
                        width={20}
                        height={20}
                        className='text-foreground/50'
                        onClick={() => setIsShow(!isShow)}
                      />
                    )}
                  </span>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='mt-2 flex w-full justify-end'>
              {!isPending ? (
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
