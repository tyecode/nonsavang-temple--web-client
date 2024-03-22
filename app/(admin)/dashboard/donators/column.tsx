/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ColumnDef } from '@tanstack/react-table'
import {
  CaretSortIcon,
  CheckIcon,
  DotsHorizontalIcon,
} from '@radix-ui/react-icons'
import { Spinner } from '@nextui-org/react'

import { Donator } from '@/types/donator'

import { deleteDonator, updateDonator } from '@/actions/donator-actions'

import { useDonatorStore } from '@/stores'

import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/date-format'

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

import { DONATOR_TITLES } from '@/constants/title-name'

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
      const [isPending, startTransition] = useTransition()
      const [isOpen, setIsOpen] = useState(false)
      const [openTitle, setOpenTitle] = useState(false)

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

            setDonators(newDonators as Donator[])
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

            setDonators(newDonators as Donator[])
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
                                ? DONATOR_TITLES.find(
                                    (option: { id: number; title: string }) =>
                                      option.title === field.value
                                  )?.title
                                : 'ເລືອກຄຳນຳໜ້າ...'}
                              <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <FormMessage />
                        <PopoverContent className='w-[400px] p-0'>
                          <Command>
                            <CommandGroup className='max-h-[200px] overflow-y-scroll'>
                              {DONATOR_TITLES.map(
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

                <div className='grid grid-cols-2 gap-4'>
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
                  name='village'
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel className='pointer-events-none'>
                        ບ້ານ
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
                  name='district'
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel className='pointer-events-none'>
                        ເມືອງ
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
                  name='province'
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel className='pointer-events-none'>
                        ແຂວງ
                      </FormLabel>
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
