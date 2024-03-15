'use client'

import { useTransition, useState } from 'react'

import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

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
import { LoadingButton } from '@/components/buttons'

import { handleLogin } from '@/actions/auth-actions'
import { ModeToggle } from '@/components/mode-toggle'

export default function Login({
  searchParams,
}: {
  searchParams: { error: string }
}) {
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='absolute left-1/2 top-1/2 w-[27rem] -translate-x-1/2 -translate-y-1/2 p-6'>
      <form
        action={(formData: FormData) =>
          startTransition(async () => await handleLogin(formData))
        }
      >
        <Card>
          <CardHeader className='mb-4 space-y-3'>
            <CardTitle className='flex-center relative flex-col text-center text-3xl'>
              <Image src='/logo.png' alt='logo' width={84} height={84} />
              <span className='mt-4 text-2xl font-bold'>ວັດໂນນສະຫວ່າງ</span>
              <div className='absolute right-0 top-0'>
                <ModeToggle />
              </div>
            </CardTitle>
            <CardDescription className='!mt-2 text-center'>
              ປ້ອນອີເມວ ແລະ ລະຫັດຜ່ານເພື່ອເຂົ້າສູ່ລະບົບ
            </CardDescription>
          </CardHeader>
          <CardContent className='grid gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='email'>ອີເມວ</Label>
              <Input
                name='email'
                id='email'
                type='email'
                required
                disabled={isPending}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='password'>ລະຫັດຜ່ານ</Label>
              <div className='group relative'>
                <Input
                  name='password'
                  id='password'
                  type={isOpen ? 'text' : 'password'}
                  required
                  className='pr-12'
                  disabled={isPending}
                />
                <span className='absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer opacity-0 duration-200 group-hover:opacity-100'>
                  {isOpen ? (
                    <FontAwesomeIcon
                      icon={faEye}
                      width={20}
                      height={20}
                      className='text-foreground/50'
                      onClick={() => setIsOpen(!isOpen)}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faEyeSlash}
                      width={20}
                      height={20}
                      className='text-foreground/50'
                      onClick={() => setIsOpen(!isOpen)}
                    />
                  )}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className='flex flex-col'>
            {!isPending ? (
              <Button className='w-full' type='submit' size={'sm'}>
                ເຂົ້າສູ່ລະບົບ
              </Button>
            ) : (
              <LoadingButton className='w-full'>ເຂົ້າສູ່ລະບົບ</LoadingButton>
            )}
          </CardFooter>
          {searchParams.error && (
            <p className='py- mb-5 w-full text-center font-noto-lao text-sm text-danger'>
              {'ອີເມວ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ'}
            </p>
          )}
        </Card>
      </form>
    </div>
  )
}
