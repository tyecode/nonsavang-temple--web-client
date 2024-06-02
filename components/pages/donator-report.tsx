'use client'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate } from '@/lib/date-format'
import { Skeleton } from '../ui/skeleton'

export function DonatorReport({
  data,
  isPending,
}: {
  data: any[]
  isPending: boolean
}) {
  return (
    <Table className='w-full border-collapse border-spacing-0 border'>
      <TableHeader>
        <TableRow>
          <TableHead className='!w-14 border text-center'>{'ລຳດັບ'}</TableHead>
          <TableHead className='!w-28 border text-center'>{'ວັນທີ່'}</TableHead>
          <TableHead className='border text-center'>
            {'ຊື່ ແລະ ນາມສະກຸນ'}
          </TableHead>
          <TableHead className='border text-center'>
            {'ທີ່ຢູ່ (ບ້ານ)'}
          </TableHead>
          <TableHead className='border text-center'>
            {'ທີ່ຢູ່ (ເມືອງ)'}
          </TableHead>
          <TableHead className='border text-center'>
            {'ທີ່ຢູ່ (ແຂວງ)'}
          </TableHead>
          <TableHead className='border text-center'>{`ຈຳນວນບໍລິຈາກ`}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isPending ? (
          [...Array(4)].map((_, index) => (
            <TableRow key={index}>
              <TableCell className='!w-14 border text-center'>
                <Skeleton className='h-4 w-full py-1' />
              </TableCell>
              <TableCell className='!w-28 border text-center'>
                <Skeleton className='h-4 w-full py-1' />
              </TableCell>
              <TableCell className='border font-medium'>
                <Skeleton className='h-4 w-full py-1' />
              </TableCell>
              <TableCell className='border'>
                <Skeleton className='h-4 w-full py-1' />
              </TableCell>
              <TableCell className='border'>
                <Skeleton className='h-4 w-full py-1' />
              </TableCell>
              <TableCell className='border'>
                <Skeleton className='h-4 w-full py-1' />
              </TableCell>
              <TableCell className='border text-right'>
                <Skeleton className='h-4 w-full py-1' />
              </TableCell>
            </TableRow>
          ))
        ) : data && data.length > 0 ? (
          data.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell className='!w-14 border text-center'>{`${index + 1}.`}</TableCell>
              <TableCell className='!w-28 border text-center'>
                {formatDate(item.created_at).split(' ')[0]}
              </TableCell>
              <TableCell className='border font-medium'>
                {`${item.donator.title} ${item.donator.first_name} ${item.donator.last_name}`}
              </TableCell>
              <TableCell className='border'>{item.donator.village}</TableCell>
              <TableCell className='border'>{item.donator.district}</TableCell>
              <TableCell className='border'>{item.donator.province}</TableCell>
              <TableCell className='border text-right'>
                {`${item.currency.symbol}${item.amount.toLocaleString()}`}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className='border text-center'>
              ບໍ່ມີຂໍ້ມູນໃຫ້ລາຍງານ
            </TableCell>
          </TableRow>
        )}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className='border' colSpan={6}>
            ລວມທັງໝົດ
          </TableCell>
          <TableCell className='border text-right'>
            {isPending ? (
              <Skeleton className='h-4 w-full py-1' />
            ) : data && data[0]?.currency.symbol ? (
              `${data[0]?.currency.symbol}${data.reduce((acc, item) => acc + item.amount, 0).toLocaleString()}`
            ) : (
              'N/A'
            )}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
