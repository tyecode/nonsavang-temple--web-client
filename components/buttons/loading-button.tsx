import React from 'react'

import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

const LoadingButton = React.forwardRef<
  HTMLButtonElement,
  { children?: React.ReactNode; [key: string]: any }
>(({ children, ...rest }, ref) => {
  return (
    <Button ref={ref} size={'sm'} disabled {...rest}>
      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
      {children ? children : 'ກະລຸນາລໍຖ້າ'}
    </Button>
  )
})

LoadingButton.displayName = 'LoadingButton'

export default LoadingButton
