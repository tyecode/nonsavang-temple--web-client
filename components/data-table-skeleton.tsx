import { TableCell, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

const DataTableSkeleton = ({ columns }: { columns: number }) => {
  return (
    <>
      {[...Array(6)].map((array, index) => (
        <TableRow key={index}>
          <TableCell></TableCell>
          {[...Array(columns - 3)].map((array, index) => (
            <TableCell key={`table-cell-${index}`} className='py-4'>
              <Skeleton className='h-5 w-full' />
            </TableCell>
          ))}
          <TableCell></TableCell>
        </TableRow>
      ))}
    </>
  )
}

export default DataTableSkeleton
