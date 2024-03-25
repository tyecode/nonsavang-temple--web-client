import { Skeleton } from './ui/skeleton'

const PieChartSkeleton = () => {
  return (
    <>
      <div className='grid grid-cols-2 gap-8'>
        <Skeleton className='aspect-square h-full w-full rounded-full' />
        <div className='flex-center h-full w-full flex-col gap-2'>
          {[...Array(5)].map((_, index) => (
            <div key={index} className='flex-center gap-1'>
              <Skeleton className='h-3 w-3 rounded-full' />
              <Skeleton className='h-4 w-36' />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default PieChartSkeleton
