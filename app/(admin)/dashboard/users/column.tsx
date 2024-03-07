/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { ChangeEvent, useState, useTransition } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DotsHorizontalIcon, UploadIcon } from '@radix-ui/react-icons'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { useUserStore } from '@/stores/useUserStore'
import { User } from '@/types/user'
import { deleteUser, updateUser } from '@/actions/user-actions'
import { uploadImage, deleteImage } from '@/actions/image-actions'
import CreateAvatar from '@/lib/create-avatar'
import LoadingButton from '@/components/buttons/loading-button'
import { formatDate } from '@/lib/date-format'

const formSchema: any = z.object({
  first_name: z.string(),
  last_name: z.string(),
  role: z.string(),
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
      const [isPending, startTransition] = useTransition()
      const [preview, setPreview] = useState('')

      const users = useUserStore((state) => state.users)
      const setUsers = useUserStore((state) => state.setUsers)
      const { toast } = useToast()

      const current = row.original
      const options = ['ADMIN', 'HOLDER', 'USER']

      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
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
            first_name: values.first_name,
            last_name: values.last_name,
            role: values.role,
            image: uploadData
              ? `${process.env.NEXT_PUBLIC_BUCKET_PATH}/${uploadData.data.path}`
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

          setUsers(newUsers)
          toast({
            description: 'ແກ້ໄຂຂໍ້ມູນຜູ້ໃຊ້ສຳເລັດແລ້ວ.',
          })
        } catch (error) {
          console.error('Error updating user:', error)
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

            const data = users.find((user) => user.id === current.id)

            if (data?.image) {
              const imageName = data.image.split('/').pop()

              if (imageName) {
                await deleteImage(imageName)
              }
            }

            await handleUpdateUser(values, uploadData)
          })
        } catch (error) {
          console.error('Error updating user:', error)
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

          const newUsers = users.filter((user) => user.id !== id)

          setUsers(newUsers)
          toast({
            description: 'ລຶບຂໍ້ມູນຜູ້ໃຊ້ສຳເລັດແລ້ວ.',
          })
        } catch (error) {
          console.error('Error deleting user:', error)
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
                className='grid gap-4 py-4'
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

                <div className='flex flex-1 gap-4'>
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
                  name='role'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ກໍານົດສິດ</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {options.map((option, index) => (
                            <SelectItem key={`option-${index}`} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='flex w-full justify-end'>
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
