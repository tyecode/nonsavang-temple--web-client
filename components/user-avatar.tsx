'use client'

import { useEffect, useState, useTransition } from 'react'
import { Spinner } from '@nextui-org/react'

import { User } from '@/types/user'

import { handleLogout } from '@/actions/auth-actions'

import { IconsCollection } from '@/components/icons/icons-collection'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import CreateAvatar from '@/lib/create-avatar'
import { useRouter } from 'next/navigation'

const UserAvatar = ({ user, loading }: { user: User; loading: boolean }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const router = useRouter()

  useEffect(() => {
    router.prefetch('/dashboard')
  }, [])

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Avatar className='aspect-square w-10 cursor-pointer'>
          {!loading ? (
            <CreateAvatar src={user?.image} seed={`${user?.display_name}`} />
          ) : (
            <Skeleton className='h-10 w-10' />
          )}
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className='flex-center mx-6 my-2 w-80 flex-col gap-4 p-6'>
        <div className='flex-center flex-col gap-4 py-4'>
          <Avatar className='flex-center h-20 w-20 flex-col'>
            {!loading ? (
              <CreateAvatar
                src={user?.image}
                seed={`${user?.display_name}`}
                size={80}
              />
            ) : (
              <Skeleton className='h-20 w-20' />
            )}
          </Avatar>
          <div className='flex-center flex-col gap-1'>
            <h1 className='text-center text-base font-medium'>
              {!loading ? (
                `${user?.display_name}`
              ) : (
                <Skeleton className='h-4 w-56' />
              )}
            </h1>
            <p className='text-sm font-normal lowercase text-foreground/60'>
              {!loading ? user.email : <Skeleton className='h-4 w-48' />}
            </p>
          </div>
        </div>
        <ul className='flex w-full flex-col border-t pt-4'>
          <li className={user?.role === 'ADMIN' ? 'block' : 'hidden'}>
            <Button
              variant={'ghost'}
              className='w-full justify-start gap-4 text-sm font-normal'
              disabled={isPending}
              onClick={() => {
                setIsOpen(false)
                router.push('/dashboard/users')
              }}
            >
              <IconsCollection icon={'grid-icon'} />
              ໜ້າຈັດການ
            </Button>
          </li>
          <li>
            <Button
              variant={'ghost'}
              className='w-full justify-start gap-4 text-sm font-normal text-danger hover:text-danger'
              onClick={() => startTransition(() => handleLogout())}
              disabled={isPending}
            >
              {!isPending ? (
                <IconsCollection icon={'logout-icon'} />
              ) : (
                <Spinner size='sm' color='danger' labelColor='danger' />
              )}
              ອອກຈາກລະບົບ
            </Button>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  )
}

export default UserAvatar
