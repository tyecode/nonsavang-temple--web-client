import React from 'react'
import { Skeleton } from './ui/skeleton'

const LatestTransactionSkeleton = () => {
  return (
    <>
      {[...Array(5)].map((array, index) => (
        <div key={index} className='my-4 w-full'>
          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-md font-medium leading-none'>
                <Skeleton className='h-4 w-40' />
              </p>
              <p className='text-sm text-muted-foreground'>
                <Skeleton className='h-4 w-32' />
              </p>
            </div>
            <div>
              <Skeleton className='h-5 w-32' />
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default LatestTransactionSkeleton
