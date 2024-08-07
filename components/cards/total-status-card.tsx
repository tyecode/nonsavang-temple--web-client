import React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

interface TotalStatusCardProps {
  title: string
  icon: React.ElementType
  amount: string
  description?: string
  className?: string
  isPending?: boolean
}

export const TotalStatusCard: React.FC<TotalStatusCardProps> = ({
  title,
  icon: Icon,
  amount,
  description,
  className,
  isPending = false,
}) => {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-md font-medium'>{title}</CardTitle>
        <span className='text-foreground/60'>
          <Icon className='h-5 w-5' />
        </span>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            'text-inter whitespace-nowrap text-xl font-bold',
            className
          )}
        >
          {isPending ? <Skeleton className='mt-1 h-5 w-4/6' /> : amount}
        </div>
        {description && (
          <p className='text-xs text-muted-foreground'>{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
