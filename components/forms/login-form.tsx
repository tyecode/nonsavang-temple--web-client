'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useSearchParams } from 'next/navigation'

const LoginForm = () => {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const message = searchParams.get('message')

  return (
    <div className='absolute left-1/2 top-1/2 w-[25rem] -translate-x-1/2 -translate-y-1/2 p-6'>
      <form action='/api/login' method='post'>
        <Card>
          <CardHeader className='mb-4 space-y-3'>
            <CardTitle className='text-center text-3xl'>Sign in</CardTitle>
            <CardDescription className='text-center'>
              Enter your email and password to login
            </CardDescription>
          </CardHeader>
          <CardContent className='grid gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='email'>Email</Label>
              <Input name='email' id='email' type='email' required />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='password'>Password</Label>
              <Input name='password' id='password' type='password' required />
            </div>
          </CardContent>
          <CardFooter className='flex flex-col'>
            <Button
              className='w-full'
              type='submit'
              size={'sm'}
              onSubmit={(e) => e.preventDefault()}
            >
              Login
            </Button>
          </CardFooter>
          {error && (
            <p className='py- mb-5 w-full text-center font-noto-lao text-sm text-danger'>
              {'ອີເມວ ຫລື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ'}
            </p>
          )}
        </Card>
      </form>
    </div>
  )
}

export default LoginForm
