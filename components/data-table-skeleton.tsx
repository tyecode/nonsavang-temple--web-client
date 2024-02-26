import { TableCell, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

const DataTableSkeleton = () => {
  return (
    <>
      {[...Array(5)].map((array, index) => (
        <TableRow key={index}>
          <TableCell></TableCell>
          <TableCell className='py-4'>
            <Skeleton className='h-5 w-full' />
          </TableCell>
          <TableCell className='py-4'>
            <Skeleton className='h-5 w-full' />
          </TableCell>
          <TableCell className='py-4'>
            <Skeleton className='h-5 w-full' />
          </TableCell>
          <TableCell className='py-4'>
            <Skeleton className='h-5 w-full' />
          </TableCell>
          <TableCell className='py-4'>
            <Skeleton className='h-5 w-full' />
          </TableCell>
          <TableCell></TableCell>
        </TableRow>
      ))}
    </>
  )
}

export default DataTableSkeleton
