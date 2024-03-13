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

import { formatDate } from '@/lib/date-format'
import { useDonatorStore } from '@/stores'
import { createDonator, getDonator } from '@/actions/donator-actions'
import { Donator } from '@/types/donator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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

const DonatorCreateModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const setDonators = useDonatorStore((state) => state.setDonators)

  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
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
        {isPending ? (
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
