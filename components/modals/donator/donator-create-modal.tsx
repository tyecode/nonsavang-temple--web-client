'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'

import { Donator } from '@/types/donator'
import { DonatorState } from '@/stores/useDonatorStore'

import { createDonator, getDonator } from '@/actions/donator-actions'

import { useDonatorStore } from '@/stores'

import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/date-format'
import { DONATOR_TITLES } from '@/constants/title-name'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingButton } from '@/components/buttons'
import { Command, CommandGroup, CommandItem } from '@/components/ui/command'
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

const DonatorCreateModal = ({ asChild }: { asChild?: boolean }) => {
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)
  const [openTitle, setOpenTitle] = useState(false)

  const setDonators = useDonatorStore(
    (state: DonatorState) => state.setDonators
  )

  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: DONATOR_TITLES[0].title,
      first_name: '',
      last_name: '',
      village: '',
      district: '',
      province: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      try {
        const res = await createDonator({
          title: values.title,
          first_name: values.first_name,
          last_name: values.last_name,
          village: values.village,
          district: values.district,
          province: values.province,
        })

        if (res.error || !res.data) {
          toast({
            variant: 'destructive',
            description: 'ມີຂໍ້ຜິດພາດ! ເພີ່ມຂໍ້ມູນຜູ້ບໍລິຈາກບໍ່ສຳເລັດ.',
          })
          return
        }

        const donators = await getDonator()

        if (donators.error || !donators.data) return

        const newDonators = donators.data.map((item: Donator) => ({
          ...item,
          created_at: formatDate(item.created_at),
          updated_at: item.updated_at ? formatDate(item.updated_at) : undefined,
        }))

        setDonators(newDonators)
        toast({
          description: 'ເພີ່ມຂໍ້ມູນຜູ້ບໍລິຈາກສຳເລັດແລ້ວ.',
        })
      } catch (error) {
        console.error('Failed to create donator', error)
      } finally {
        setIsOpen(false)
        form.reset()
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {asChild ? (
          <Button
            type='submit'
            variant={'outline'}
            size={'sm'}
            className='w-full'
            onClick={() => setIsOpen(true)}
          >
            {'ເພິ່ມຂໍ້ມູນຜູ້ບໍລິຈາກ'}
          </Button>
        ) : isPending ? (
          <LoadingButton>ເພິ່ມຂໍ້ມູນ</LoadingButton>
        ) : (
          <Button size={'sm'}>ເພິ່ມຂໍ້ມູນ</Button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[450px]'>
        <DialogHeader>
          <DialogTitle>ເພິ່ມຂໍ້ມູນຜູ້ບໍລິຈາກ</DialogTitle>
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
              name='village'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel className='pointer-events-none'>ບ້ານ</FormLabel>
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
                  <FormLabel className='pointer-events-none'>ເມືອງ</FormLabel>
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
                  <FormLabel className='pointer-events-none'>ແຂວງ</FormLabel>
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

export default DonatorCreateModal
