import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

const AdminSetting = () => {
  return (
    <div className='container'>
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

export default AdminSetting
