import { TableCell, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

const DataTableSkeleton = ({ columns }: { columns: number }) => {
  return (
    <>
      {[...Array(6)].map((_, index) => (
        <TableRow key={index}>
          <TableCell></TableCell>
          {[...Array(columns - 3)].map((_, index) => (
            <TableCell key={`table-cell-${index}`} className='py-2'>
              <Skeleton className='h-4 w-full' />
            </TableCell>
          ))}
          <TableCell></TableCell>
        </TableRow>
      ))}
    </>
  )
}

export default DataTableSkeleton
