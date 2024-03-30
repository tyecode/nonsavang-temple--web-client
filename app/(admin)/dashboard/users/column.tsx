'use client'

import { ChangeEvent, useState, useTransition } from 'react'
import { ColumnDef } from '@tanstack/react-table'
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

import { formatDate } from '@/lib/date-format'
import CreateAvatar from '@/lib/create-avatar'
import { cn } from '@/lib/utils'

import { USER_TITLES } from '@/constants/title-name'
import { USER_ROLES } from '@/constants/user-role'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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

const formSchema: any = z.object({
  title: z.string().min(1, {
    message: 'ກະລຸນາປ້ອນຄຳນຳໜ້າ.',
  }),
  first_name: z.string().min(1, {
    message: 'ກະລຸນາປ້ອນຊື່.',
  }),
  last_name: z.string().min(1, {
    message: 'ກະລຸນາປ້ອນນາມສະກຸນ.',
  }),
  role: z.string().min(1, {
    message: 'ກະລຸນາເລືອກສິດຜູ້ໃຊ້.',
  }),
  image: z
    .custom<FileList>()
    .transform((file) => file.length > 0 && file.item(0))
    .refine((file) => !file || (!!file && file.type?.startsWith('image')), {
      message: 'ອັບໂຫຼດໄດ້ສະເພາະຮູບພາບເທົ່ານັ້ນ.',
    })
    .refine((file) => !file || (!!file && file.size <= 3 * 1024 * 1024), {
      message: 'ຮູບພາບຕ້ອງມີຂະໜາດບໍ່ເກີນ 3MB.',
    }),
})

export const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value: boolean) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'display_name',
    header: 'ຊື່ ແລະ ນາມສະກຸນ',
    cell: ({ row }) => (
      <div className='flex items-center gap-4'>
        <div className='relative min-w-10'>
          <CreateAvatar
            src={row.original.image}
            seed={row.original.display_name || ''}
          />
        </div>
        {row.original.display_name}
      </div>
    ),
  },
  {
    accessorKey: 'email',
    header: 'ອີເມວ',
  },
  {
    accessorKey: 'role',
    header: 'ສິດຜູ້ໃຊ້',
  },
  {
    accessorKey: 'created_at',
    header: 'ສ້າງວັນທີ່',
  },
  {
    accessorKey: 'updated_at',
    header: 'ອັບເດດວັນທີ່',
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const [isOpen, setIsOpen] = useState(false)
      const [openRole, setOpenRole] = useState(false)
      const [openTitle, setOpenTitle] = useState(false)
      const [preview, setPreview] = useState('')

      const [isPending, startTransition] = useTransition()

      const users = useUserStore((state) => state.users)
      const setUsers = useUserStore((state) => state.setUsers)

      const { toast } = useToast()

      const current = row.original

      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          title: current.title,
          first_name: current.first_name,
          last_name: current.last_name,
          role: current.role,
          image: '',
        },
      })

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
        values: z.infer<typeof formSchema>,
        uploadData?: { data: any; error?: null; message?: string }
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

          const newUsers = users.map((user: User) => {
            const updatedUser = res.data?.find(
              (item: User) => item.id === user.id
            )

            if (updatedUser) {
              return {
                ...updatedUser,
                created_at: formatDate(updatedUser.created_at),
                updated_at: updatedUser.updated_at
                  ? formatDate(updatedUser.updated_at)
                  : undefined,
              }
            }

            return user
          })

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

      const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
          startTransition(async () => {
            if (!values.image) {
              await handleUpdateUser(values)
              return
            }

            const uploadData = await uploadImage(values.image)

            if (uploadData.error || !uploadData.data) {
              throw new Error('Image upload failed')
            }

            const user = users.find((user) => user.id === current.id)

            if (user?.image) {
              const imageName = user.image.split('/').pop()

              if (imageName) {
                await deleteImage(imageName)
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
                ລົບຂໍ້ມູນ
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
                              size={96}
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
                        <PopoverContent className='w-[390px] p-0'>
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
                        <FormLabel className='pointer-events-none'>
                          ຊື່
                        </FormLabel>
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
                              disabled={isPending}
                              variant='outline'
                              role='combobox'
                              aria-expanded={openRole}
                              className='w-full justify-between'
                            >
                              {field.value
                                ? USER_ROLES.find(
                                    (role: { id: number; title: string }) =>
                                      role.title === field.value
                                  )?.title
                                : 'ເລືອກສະກຸນເງິນ...'}
                              <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <FormMessage />
                        <PopoverContent className='w-[180px] p-0'>
                          <Command>
                            <CommandGroup className='max-h-[200px] overflow-y-scroll'>
                              {USER_ROLES.map(
                                (role: { id: number; title: string }) => (
                                  <CommandItem
                                    key={role.id}
                                    value={role.title}
                                    onSelect={() => {
                                      field.onChange(role.title)
                                      setOpenRole(false)
                                    }}
                                  >
                                    {role.title}
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
    },
  },
]
