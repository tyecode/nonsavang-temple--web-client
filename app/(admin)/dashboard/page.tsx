'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

const Dashboard = () => {
  const router = useRouter()

  useEffect(() => {
    router.push('dashboard/users')
  })

  return (
    <div>
      <Table>
        <TableBody>
          {[...Array(8)].map((array, index) => (
            <TableRow key={`row-${index}`}>
              <TableCell>
                <Skeleton className='h-5 grow' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-5 grow' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-5 grow' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-5 grow' />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default Dashboard
