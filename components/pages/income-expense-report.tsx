'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate } from '@/lib/date-format'

export function IncomeExpenseReport({ data }: { data: any[] }) {
  return (
    <Table className='w-full border-collapse border-spacing-0 border'>
      <TableHeader>
        <TableRow>
          <TableHead className='!w-14 border text-center'>{'ລຳດັບ'}</TableHead>
          <TableHead className='!w-28 border text-center'>{'ວັນທີ່'}</TableHead>
          <TableHead className='border text-center'>
            {'ປະເພດລາຍຮັບ/ລາຍຈ່າຍ'}
          </TableHead>
          <TableHead className='border text-center'>{'ໝາຍເຫດ'}</TableHead>
          <TableHead className='border text-center'>{'ລາຍຮັບ'}</TableHead>
          <TableHead className='border text-center'>{'ລາຍຈ່າຍ'}</TableHead>
          <TableHead className='border text-center'>{'ຍອດລວມ'}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data && data.length > 0 ? (
          data.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell className='!w-14 border text-center'>{`${index + 1}.`}</TableCell>
              <TableCell className='!w-28 border text-center'>
                {formatDate(item.created_at).split(' ')[0]}
              </TableCell>
              <TableCell className='border'>{item.category.name}</TableCell>
              <TableCell className='border'>{item.remark}</TableCell>
              <TableCell className='border text-end'>
                {item.transaction_type === 'income'
                  ? `${item.currency.symbol}${Math.abs(item.amount).toLocaleString()}`
                  : '-'}
              </TableCell>
              <TableCell className='border text-end'>
                {item.transaction_type === 'expense'
                  ? `-${item.currency.symbol}${Math.abs(item.amount).toLocaleString()}`
                  : '-'}
              </TableCell>
              <TableCell className='border text-end'>
                {item.amount < 0
                  ? `-${item.currency.symbol}${Math.abs(item.amount).toLocaleString()}`
                  : `${item.currency.symbol}${Math.abs(item.amount).toLocaleString()}`}
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
          <TableCell className='border' colSpan={4}>
            ລວມທັງໝົດ
          </TableCell>
          <TableCell className='border text-end'>
            {data.length > 0
              ? `${data[0]?.currency.symbol}` +
                data
                  .filter((item) => item.transaction_type === 'income')
                  .reduce((acc, item) => acc + item.amount, 0)
                  .toLocaleString()
              : 'N/A'}
          </TableCell>
          <TableCell className='border text-end'>
            {data.length > 0
              ? `-${data[0]?.currency.symbol}` +
                Math.abs(
                  data
                    .filter((item) => item.transaction_type === 'expense')
                    .reduce((acc, item) => acc + item.amount, 0)
                ).toLocaleString()
              : 'N/A'}
          </TableCell>
          <TableCell className='border text-end'>
            {data.length > 0
              ? (() => {
                  const sum = data.reduce((acc, item) => acc + item.amount, 0)
                  const symbol = data[0]?.currency.symbol
                  return (
                    (sum < 0 ? `-${symbol}` : symbol) +
                    Math.abs(sum).toLocaleString()
                  )
                })()
              : 'N/A'}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
