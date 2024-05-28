'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Loader2 } from 'lucide-react'

import { User } from '@/types/user'
import { handleLogout } from '@/actions/auth-actions'
import { CreateAvatar } from '@/lib/create-avatar'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const UserAvatar = ({ user, loading }: { user: User; loading: boolean }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const router = useRouter()

  useEffect(() => {
    router.prefetch('/login')
  }, [])

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        {!loading ? (
          <CreateAvatar src={user?.image} seed={`${user?.display_name}`} />
        ) : (
          <Skeleton className='h-10 w-10 rounded-full' />
        )}
      </PopoverTrigger>
      <PopoverContent className='flex-center mx-6 my-2 w-80 flex-col gap-4 p-4'>
        <div className='flex-center flex-col gap-4 py-4'>
          {!loading ? (
            <CreateAvatar
              src={user?.image}
              seed={`${user?.display_name}`}
              className='h-20 w-20'
            />
          ) : (
            <Skeleton className='h-20 w-20 rounded-full' />
          )}
          <div className='flex-center flex-col gap-1'>
            {!loading ? (
              <h1 className='text-center text-base font-medium'>
                {user?.display_name}
              </h1>
            ) : (
              <Skeleton className='my-1 h-4 w-56' />
            )}
            {!loading ? (
              <p className='text-sm font-normal lowercase text-foreground/60'>
                {user.email}
              </p>
            ) : (
              <Skeleton className='h-4 w-48' />
            )}
            {!loading ? (
              <p className='mt-1 text-xs font-normal text-foreground/60'>
                {user.role}
              </p>
            ) : (
              <Skeleton className='mt-1 h-4 w-24' />
            )}
          </div>
        </div>
        <ul className='flex w-full flex-col border-t pt-4'>
          <li>
            <Button
              variant={'ghost'}
              size={'sm'}
              className='w-full justify-start text-sm font-normal text-danger hover:text-danger'
              onClick={() => startTransition(() => handleLogout())}
              disabled={isPending}
            >
              {!isPending ? (
                <LogOut className='mr-2 h-4 w-4' />
              ) : (
                <Loader2 className='mr-2 h-4 w-4 animate-spin text-danger' />
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
