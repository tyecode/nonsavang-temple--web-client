/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { useState, useTransition } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

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
import { Spinner } from '@nextui-org/react'
import { useToast } from '@/components/ui/use-toast'
import { LoadingButton } from '@/components/buttons'

import { formatDate } from '@/lib/date-format'

import { Donator } from '@/types/donator'

import { deleteDonator, updateDonator } from '@/actions/donator-actions'

import { useDonatorStore } from '@/stores'

const formSchema: any = z.object({
  title: z.string().min(1, {
    message: 'ກະລຸນາເລືອກຄຳນຳໜ້າ.',
  }),
  first_name: z.string().min(1, {
    message: 'ກະລຸນາປ້ອນຊື່.',
  }),
  last_name: z.string().min(1, {
    message: 'ກະລຸນາປ້ອນນາມສະກຸນ.',
  }),
  village: z.string(),
  district: z.string(),
  province: z.string(),
})

export const columns: ColumnDef<Donator>[] = [
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
  },
  {
    accessorKey: 'village',
    header: 'ບ້ານ',
  },
  {
    accessorKey: 'district',
    header: 'ເມືອງ',
  },
  {
    accessorKey: 'province',
    header: 'ແຂວງ',
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

      const donators = useDonatorStore((state) => state.donators)
      const setDonators = useDonatorStore((state) => state.setDonators)
      const { toast } = useToast()

      const current = row.original

      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          title: current.title,
          first_name: current.first_name,
          last_name: current.last_name,
          village: current.village,
          district: current.district,
          province: current.province,
        },
      })

      const onSubmit = async (values: z.infer<typeof formSchema>) => {
        startTransition(async () => {
          try {
            const res = await updateDonator(current.id, {
              title: values.title,
              first_name: values.first_name,
              last_name: values.last_name,
              village: values.village,
              district: values.district,
              province: values.province,
              updated_at: new Date(),
            })

            if (res.error || !res.data) {
              toast({
                variant: 'destructive',
                description: 'ມີຂໍ້ຜິດພາດ! ບໍ່ສາມາດແກ້ໄຂຂໍ້ມູນໄດ້.',
              })
              return
            }

            const newDonators = donators.map((donator: Donator) => {
              const updatedDonator = res.data?.find(
                (item: Donator) => item.id === donator.id
              )

              if (updatedDonator) {
                return {
                  ...updatedDonator,
                  created_at: formatDate(updatedDonator.created_at),
                  updated_at: updatedDonator.updated_at
                    ? formatDate(updatedDonator.updated_at)
                    : undefined,
                }
              }

              return donator
            })

            setDonators(newDonators)
            toast({
              description: 'ແກ້ໄຂຂໍ້ມູນຜູ້ບໍລິຈາກສຳເລັດແລ້ວ.',
            })
          } catch (error) {
            console.error('Error updating donator:', error)
          } finally {
            setIsOpen(false)
          }
        })
      }

      const handleDeleteDonator = async (id: string) => {
        startTransition(async () => {
          try {
            const res = await deleteDonator(id)

            if (res.error || !res.data) {
              toast({
                variant: 'destructive',
                description: 'ມີຂໍ້ຜິດພາດ! ບໍ່ສາມາດລຶບຂໍ້ມູນຜູ້ບໍລິຈາກໄດ້.',
              })
              return
            }

            const newDonators = donators.filter((donator) => donator.id !== id)

            setDonators(newDonators)
            toast({
              description: 'ລຶບຂໍ້ມູນຜູ້ບໍລິຈາກສຳເລັດແລ້ວ.',
            })
          } catch (error) {
            console.error('Error deleting donator:', error)
          }
        })
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
                disabled={isPending}
                onClick={() => navigator.clipboard.writeText(current.id)}
              >
                ຄັດລອກໄອດີ
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem disabled={isPending}>
                  ແກ້ໄຂຂໍ້ມູນ
                </DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuItem
                disabled={isPending}
                onClick={() => handleDeleteDonator(current.id)}
                className='gap-4 text-danger transition-none focus:text-danger'
              >
                <span>ລົບຂໍ້ມູນ</span>
                {isPending && (
                  <Spinner size='sm' color='danger' labelColor='danger' />
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>ແກ້ໄຂຂໍ້ມູນຜູ້ບໍລິຈາກ</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='grid gap-2 py-4'
              >
                <div className='grid grid-cols-3 gap-4'>
                  <FormField
                    control={form.control}
                    name='title'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ຄຳນຳໜ້າ</FormLabel>
                        <Select
                          disabled={isPending}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className='flex-1'>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={'ແມ່ຕູ້'}>ແມ່ຕູ້</SelectItem>
                            <SelectItem value={'ພໍ່ຕູ້'}>ພໍ່ຕູ້</SelectItem>
                            <SelectItem value={'ແມ່ອອກ'}>ແມ່ອອກ</SelectItem>
                            <SelectItem value={'ພໍ່ອອກ'}>ພໍ່ອອກ</SelectItem>
                            <SelectItem value={'ນາງ'}>ນາງ</SelectItem>
                            <SelectItem value={'ທ້າວ'}>ທ້າວ</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='first_name'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormLabel>ຊື່</FormLabel>
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
                        <FormLabel>ນາມສະກຸນ</FormLabel>
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
                  name='village'
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel>ບ້ານ</FormLabel>
                      <FormControl>
                        <Input disabled={isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='district'
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel>ເມືອງ</FormLabel>
                      <FormControl>
                        <Input disabled={isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='province'
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel>ແຂວງ</FormLabel>
                      <FormControl>
                        <Input disabled={isPending} {...field} />
                      </FormControl>
                      <FormMessage />
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
