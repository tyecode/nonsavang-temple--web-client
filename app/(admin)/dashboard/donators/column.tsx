/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { useState, useTransition } from 'react'

import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useDonatorStore } from '@/stores/useDonatorStore'
import { useToast } from '@/components/ui/use-toast'
import { Donator } from '@/types/donator'
import { deleteDonator, updateDonator } from '@/actions/donator-actions'
import { UpdateDonatorModal } from '@/components/modals/donator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import LoadingButton from '@/components/buttons/loading-button'
import { formatDate } from '@/lib/date-format'

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
    cell: ({ row }) => (
      <div className='flex items-center gap-4'>{row.original.display_name}</div>
    ),
  },
  {
    accessorKey: 'address',
    header: 'ທີ່ຢູ່',
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
      const current = row.original

      const donators: Donator[] = useDonatorStore((state) => state.donators)
      const updateDonators = useDonatorStore((state) => state.updateDonators)
      const { toast } = useToast()
      const [isOpen, setIsOpen] = useState(false)
      const [isPending, startTransition] = useTransition()

      const handleUpdateDonator = (formData: FormData) => {
        const object = {
          first_name: String(formData.get('firstname')),
          last_name: String(formData.get('lastname')),
          address: String(formData.get('address')),
          updated_at: new Date(),
        }

        startTransition(async () => {
          try {
            const res = await updateDonator(current.id, object)

            if (res.error || !res.data) {
              toast({
                description: 'ມີຂໍ້ຜິດພາດ! ແກ້ໄຂຂໍ້ມູນຜູ້ບໍລິຈາກບໍ່ສຳເລັດ.',
              })
              return
            }

            const newDonators = [
              ...donators.filter((donator) => donator.id !== current.id),
              ...res.data.map((item) => ({
                ...item,
                created_at: formatDate(item.created_at),
                updated_at: formatDate(item.updated_at),
              })),
            ]

            updateDonators(newDonators)
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
        try {
          const res = await deleteDonator(id)

          if (res.error) {
            toast({
              variant: 'destructive',
              description: 'ມີຂໍ້ຜິດພາດ! ບໍ່ສາມາດລຶບຂໍ້ມູນຜູ້ບໍລິຈາກໄດ້.',
            })
            return
          }

          const newDonators = donators.filter((donator) => donator.id !== id)

          updateDonators(newDonators)
          toast({
            description: 'ລຶບຂໍ້ມູນຜູ້ບໍລິຈາກສຳເລັດແລ້ວ.',
          })
        } catch (error) {
          console.error('Error deleting donator:', error)
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
                onClick={() => handleDeleteDonator(current.id)}
                className='text-danger transition-none focus:text-danger'
              >
                ລົບຂໍ້ມູນ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>ແກ້ໄຂຂໍ້ມູນຜູ້ບໍລິຈາກ</DialogTitle>
            </DialogHeader>
            <form action={handleUpdateDonator} className='grid gap-4 py-4'>
              <div className='grid items-center gap-4'>
                <Label htmlFor='firstname'>ຊື່</Label>
                <Input
                  id='firstname'
                  name='firstname'
                  className='col-span-3'
                  type='text'
                  placeholder='ປ້ອນຊື່ຜູ້ບໍລິຈາກ'
                  defaultValue={current.first_name}
                  required
                />
              </div>
              <div className='grid items-center gap-4'>
                <Label htmlFor='lastname'>ນາມສະກຸນ</Label>
                <Input
                  id='lastname'
                  name='lastname'
                  className='col-span-3'
                  type='text'
                  placeholder='ປ້ອນນາມສະກຸນຜູ້ບໍລິຈາກ'
                  defaultValue={current.last_name}
                  required
                />
              </div>
              <div className='grid items-center gap-4'>
                <Label htmlFor='lastname'>ທີ່ຢູ່</Label>
                <Textarea
                  id='address'
                  name='address'
                  className='col-span-3'
                  placeholder='ປ້ອນທີ່ຢູ່ຜູ້ບໍລິຈາກ'
                  defaultValue={current.address}
                />
              </div>
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
          </DialogContent>
        </Dialog>
      )
    },
  },
]
