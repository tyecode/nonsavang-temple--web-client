'use client'

import { ChangeEvent, useEffect, useState, useTransition } from 'react'
import { Row } from '@tanstack/react-table'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CaretSortIcon,
  CheckIcon,
  DotsHorizontalIcon,
  UploadIcon,
} from '@radix-ui/react-icons'

import { User } from '@/types/user'
import { deleteUser, updateUser } from '@/actions/user-actions'
import { uploadImage, deleteImage } from '@/actions/image-actions'
import { useUserStore } from '@/stores/useUserStore'
import { CreateAvatar } from '@/lib/create-avatar'
import { cn } from '@/lib/utils'

import { USER_TITLES } from '@/constants/title-name'
import { USER_ROLES } from '@/constants/user-role'

import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandItem } from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useToast } from '@/components/ui/use-toast'
import { LoadingButton } from '@/components/buttons'
import { userUpdateSchema } from './schema'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData extends User>({
  row,
}: DataTableRowActionsProps<TData>) {
  const current: User = row.original

  const [isOpen, setIsOpen] = useState(false)
  const [openRole, setOpenRole] = useState(false)
  const [openTitle, setOpenTitle] = useState(false)
  const [preview, setPreview] = useState('')

  const [isPending, startTransition] = useTransition()

  const users = useUserStore((state) => state.users)
  const setUsers = useUserStore((state) => state.setUsers)

  const { toast } = useToast()

  const form = useForm<z.infer<typeof userUpdateSchema>>({
    resolver: zodResolver(userUpdateSchema),
  })

  useEffect(() => {
    form.reset({
      title: current.title,
      first_name: current.first_name,
      last_name: current.last_name,
      role: current.role,
      image: null,
    })
    setPreview('')
  }, [current, form])

  const getImageData = (event: ChangeEvent<HTMLInputElement>) => {
    const dataTransfer = new DataTransfer()

    Array.from(event.target.files!).forEach((image) =>
      dataTransfer.items.add(image)
    )

    const files = dataTransfer.files
    const displayUrl = URL.createObjectURL(event.target.files![0])

    return { files, displayUrl }
  }

  const handleUpdateUser = async (
    values: z.infer<typeof userUpdateSchema>,
    uploadData?: { data: any; error?: any; message?: string }
  ) => {
    try {
      const res = await updateUser(current.id, {
        title: values.title,
        first_name: values.first_name,
        last_name: values.last_name,
        role: values.role,
        image: uploadData
          ? `${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_PATH}/${uploadData.data.path}`
          : undefined,
      })

      if (res.error || !res.data) {
        toast({
          variant: 'destructive',
          description: 'ມີຂໍ້ຜິດພາດ! ບໍ່ສາມາດແກ້ໄຂຂໍ້ມູນໄດ້.',
        })
        return
      }

      const newUsers = users.reduce((acc: User[], user: User) => {
        const updatedUser: User = res.data?.find(
          (item: User) => item.id === user.id
        )
        return [...acc, updatedUser || user]
      }, [])

      setUsers(newUsers as User[])
      toast({
        description: 'ແກ້ໄຂຂໍ້ມູນຜູ້ໃຊ້ສຳເລັດແລ້ວ.',
      })
    } catch (error) {
      console.error('Error updating user: ', error)
    } finally {
      setIsOpen(false)
    }
  }

  const onSubmit = async (values: z.infer<typeof userUpdateSchema>) => {
    try {
      startTransition(async () => {
        let uploadData

        if (values.image) {
          uploadData = await uploadImage(values.image)

          const user = users.find((user) => user.id === current.id)

          if (user?.image) {
            const imageName = user.image.split('/').pop()

            if (imageName) {
              await deleteImage(imageName)
            }
          }
        }

        await handleUpdateUser(values, uploadData)
      })
    } catch (error) {
      console.error('Error upload user image: ', error)
    }
  }

  const handleDeleteUser = async (id: string) => {
    try {
      const res = await deleteUser(id)

      if (res.error || !res.data) {
        toast({
          variant: 'destructive',
          description: 'ມີຂໍ້ຜິດພາດ! ບໍ່ສາມາດລຶບຂໍ້ມູນຜູ້ໃຊ້ໄດ້.',
        })
        return
      }

      const user = users.find((user) => user.id === current.id)

      if (user?.image) {
        const imageName = user.image.split('/').pop()

        if (imageName) {
          await deleteImage(imageName)
        }
      }

      const newUsers = users.filter((user) => user.id !== id)

      setUsers(newUsers as User[])
      toast({
        description: 'ລຶບຂໍ້ມູນຜູ້ໃຊ້ສຳເລັດແລ້ວ.',
      })
    } catch (error) {
      console.error('Error deleting user: ', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='float-right h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <DotsHorizontalIcon className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(current.id)}
          >
            ຄັດລອກໄອດີ
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem>ແກ້ໄຂຂໍ້ມູນ</DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem
            onClick={() => handleDeleteUser(current.id)}
            className='text-danger transition-none focus:text-danger'
          >
            ລຶບຂໍ້ມູນ
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>ແກ້ໄຂຂໍ້ມູນຜູ້ໃຊ້</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='grid gap-2 py-4'
          >
            <div className='flex-center flex-1'>
              <FormField
                control={form.control}
                name='image'
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem className='flex-center w-fit flex-col'>
                    <FormLabel>
                      <div className='group relative h-24 w-24 cursor-pointer rounded-full'>
                        <CreateAvatar
                          src={preview || current.image}
                          seed={current.display_name || ''}
                          className='h-24 w-24'
                        />
                        <div className='flex-center absolute left-0 top-0 h-full w-full bg-background/60 text-foreground/70 opacity-0 duration-200 group-hover:opacity-100'>
                          <UploadIcon width={26} height={26} />
                        </div>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        type='file'
                        accept='image/*'
                        className='hidden'
                        onChange={(event) => {
                          const { files, displayUrl } = getImageData(event)
                          setPreview(displayUrl)
                          onChange(files)
                        }}
                        {...rest}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

            <div className='flex flex-1 gap-4'>
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
              name='role'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel className='pointer-events-none my-[5px]'>
                    ກໍານົດສິດ
                  </FormLabel>
                  <Popover open={openRole} onOpenChange={setOpenRole}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          disabled={isPending || field.value === 'SUPER_ADMIN'}
                          variant='outline'
                          role='combobox'
                          aria-expanded={openRole}
                          className='w-full justify-between'
                        >
                          {field.value === 'SUPER_ADMIN'
                            ? 'Super Admin'
                            : field.value
                              ? USER_ROLES.find(
                                  (role: { id: number; title: string }) =>
                                    role.title === field.value
                                )?.label
                              : 'ເລືອກສະກຸນເງິນ...'}
                          <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <FormMessage />
                    <PopoverContent className='w-[375px] p-0'>
                      <Command>
                        <CommandGroup className='max-h-[200px] overflow-y-scroll'>
                          {USER_ROLES.map(
                            (role: {
                              id: number
                              title: string
                              label: string
                            }) => (
                              <CommandItem
                                key={role.id}
                                value={role.title}
                                onSelect={() => {
                                  field.onChange(role.title)
                                  setOpenRole(false)
                                }}
                              >
                                {role.label}
                                <CheckIcon
                                  className={cn(
                                    'ml-auto h-4 w-4',
                                    field.value === role.title
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

            <div className='mt-2 flex w-full justify-end'>
              {!isPending ? (
                <Button type='submit' size={'sm'} className='w-fit'>
                  ແກ້ໄຂຂໍ້ມູນ
                </Button>
              ) : (
                <LoadingButton>ແກ້ໄຂຂໍ້ມູນ</LoadingButton>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
