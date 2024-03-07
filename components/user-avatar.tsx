'use client'

import { useEffect, useState, useTransition } from 'react'

import { User } from '@/types/user'

import { getSession, handleLogout } from '@/actions/auth-actions'
import { getUser } from '@/actions/user-actions'

import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from './ui/skeleton'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { IconsCollection } from '@/components/icons/radix-icons-collection'

import CreateAvatar from '@/lib/create-avatar'
import Link from 'next/link'
import { Spinner } from '@nextui-org/react'

const UserAvatar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User>()
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const fetchUser = async () => {
      const session = await getSession()

      if (session?.user?.id) {
        const { data } = await getUser(session.user.id)
        setUser(data[0])
      }
    }

    fetchUser()
  }, [])

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Avatar className='aspect-square w-10 cursor-pointer'>
          {user ? (
            <CreateAvatar seed={`${user.first_name} ${user.last_name}`} />
          ) : (
            <Skeleton className='h-10 w-10' />
          )}
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className='flex-center mx-6 my-2 w-80 flex-col gap-4 p-6'>
        <div className='flex-center flex-col gap-4 py-4'>
          <Avatar className='flex-center h-20 w-20 flex-col'>
            {user ? (
              <CreateAvatar
                seed={`${user.first_name} ${user.last_name}`}
                size={80}
              />
            ) : (
              <Skeleton className='h-20 w-20' />
            )}
          </Avatar>
          <div className='flex-center flex-col gap-1'>
            <h1 className='text-center text-base font-medium'>
              {user ? (
                `${user.first_name} ${user.last_name}`
              ) : (
                <Skeleton className='h-4 w-56' />
              )}
            </h1>
            <p className='text-sm font-normal lowercase text-foreground/60'>
              {user ? user.email : <Skeleton className='h-4 w-48' />}
            </p>
          </div>
        </div>
        <ul className='flex w-full flex-col border-t pt-4'>
          <li>
            <Link href='/dashboard' onClick={() => setIsOpen(false)}>
              <Button
                variant={'ghost'}
                className='w-full justify-start gap-4 text-sm font-normal'
                disabled={isPending}
              >
                <IconsCollection icon={'DashboardIcon'} />
                ໜ້າຈັດການ
              </Button>
            </Link>
          </li>
          <li>
            <Button
              variant={'ghost'}
              className='w-full justify-start gap-4 text-sm font-normal text-danger hover:text-danger'
              onClick={() => startTransition(() => handleLogout())}
              disabled={isPending}
            >
              {!isPending ? (
                <IconsCollection icon={'ExitIcon'} />
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
