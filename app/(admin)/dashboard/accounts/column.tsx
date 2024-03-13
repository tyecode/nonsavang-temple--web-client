/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ColumnDef } from '@tanstack/react-table'

import { Account } from '@/types/account'
import { Currency } from '@/types/currency'

import { deleteAccount, updateAccount } from '@/actions/account-actions'
import { getCurrency } from '@/actions/currency-actions'

import { useAccountStore } from '@/stores/useAccountStore'
import { formatDate } from '@/lib/date-format'

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
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { LoadingButton } from '@/components/buttons'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'

const formSchema: any = z.object({
  balance: z
    .string()
    .nonempty('ປ້ອນຈຳນວນເງິນ.')
    .regex(/^[-]?\d+$/, {
      message: 'ຈຳນວນເງິນຕ້ອງເປັນຕົວເລກເທົ່ານັ້ນ.',
    })
    .refine((value) => Number(value) >= 0, {
      message: 'ປ້ອນຈຳນວນເງິນບໍ່ຖືກຕ້ອງ.',
    }),
  currency: z.string(),
  remark: z.string(),
})

export const columns: ColumnDef<Account>[] = [
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
    accessorKey: 'user',
    header: 'ເຈົ້າຂອງບັນຊີ',
    cell: ({ row }) => {
      const current = row.original
      return current.user
        ? `${current.user.first_name} ${current.user.last_name}`
        : ''
    },
  },
  {
    accessorKey: 'name',
    header: 'ຊື່ບັນຊີ',
  },
  {
    accessorKey: 'balance',
    header: 'ຈຳນວນເງິນ',
    cell: ({ row }) => {
      const current = row.original
      return current.currency && current.currency.name
        ? `${current.balance} ${current.currency.name}`
        : ''
    },
  },
  {
    accessorKey: 'remark',
    header: 'ໝາຍເຫດ',
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
      const [options, setOptions] = useState<Currency[]>([])
      const [isPending, startTransition] = useTransition()

      const accounts = useAccountStore((state) => state.accounts)
      const setAccounts = useAccountStore((state) => state.setAccounts)

      const { toast } = useToast()

      const current = row.original

      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          balance: current.balance.toString(),
          currency: current.currency.code,
          remark: current.remark,
        },
      })

      useEffect(() => {
        const getCurrencyData = async () => {
          try {
            const res = await getCurrency()

            if (res.error || !res.data) return

            const sortedData = res.data.sort(
              (a: { code: string }, b: { code: string }) =>
                a.code.localeCompare(b.code)
            )
            setOptions(sortedData)
          } catch (error) {
            console.error('Error fetching currency:', error)
          }
        }

        if (options.length > 0) return

        getCurrencyData()
      }, [options])

      const onSubmit = (values: z.infer<typeof formSchema>) => {
        startTransition(async () => {
          try {
            const accountData = {
              balance: current.balance,
              currency_id: current.currency.id,
              remark: values.remark,
              updated_at: new Date(),
            }

            const res = await updateAccount(current.id, accountData)

            if (res.error || !res.data) {
              toast({
                variant: 'destructive',
                description: 'ມີຂໍ້ຜິດພາດ! ບໍ່ສາມາດແກ້ໄຂຂໍ້ມູນບັນຊີໄດ້.',
              })
              return
            }

            const newAccounts = accounts.map((account: Account) => {
              const updatedAccount: any = res.data?.find(
                (item) => item.id === account.id
              )

              if (updatedAccount) {
                return {
                  ...updatedAccount,
                  created_at: formatDate(updatedAccount.created_at),
                  updated_at: updatedAccount.updated_at
                    ? formatDate(updatedAccount.updated_at)
                    : undefined,
                }
              }

              return account
            })

            setAccounts(newAccounts as Account[])
            toast({
              description: 'ແກ້ໄຂຂໍ້ມູນບັນຊີສຳເລັດແລ້ວ.',
            })
          } catch (error) {
            console.error('Error updating account:', error)
          } finally {
            setIsOpen(false)
          }
        })
      }

      const handleDeleteAccount = async (id: string) => {
        try {
          const res = await deleteAccount(id)

          if (res.error) {
            toast({
              variant: 'destructive',
              description: 'ມີຂໍ້ຜິດພາດ! ບໍ່ສາມາດລຶບຂໍ້ມູນບັນຊີໄດ້.',
            })
            return
          }

          const newAccounts = accounts.filter((account) => account.id !== id)

          setAccounts(newAccounts)
          toast({
            description: 'ລຶບຂໍ້ມູນບັນຊີສຳເລັດແລ້ວ.',
          })
        } catch (error) {
          console.error('Error deleting account:', error)
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
                onClick={() => handleDeleteAccount(current.id)}
                className='text-danger transition-none focus:text-danger'
              >
                ລົບຂໍ້ມູນ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>ແກ້ໄຂຂໍ້ມູນບັນຊີ</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='grid gap-4 py-4'
              >
                <div className='flex gap-4'>
                  <FormField
                    control={form.control}
                    name='balance'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormLabel>ຈຳນວນເງິນ</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='currency'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ສະກຸນເງິນ</FormLabel>
                        <Select
                          disabled={isPending}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className='w-32' disabled>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {options.map((option, index) => (
                              <SelectItem
                                key={`option-${index}`}
                                value={option.code}
                              >
                                {option.code}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='remark'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ໝາຍເຫດ</FormLabel>
                      <Textarea className='col-span-3' {...field} />
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
