'use client'

import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function LatestTransactionSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <div key={index} className='my-4 w-full'>
          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <div className='text-md font-medium leading-none'>
                <Skeleton className='h-4 w-40' />
              </div>
              <div className='text-sm text-muted-foreground'>
                <Skeleton className='h-4 w-32' />
              </div>
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
