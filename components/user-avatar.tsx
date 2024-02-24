'use client'

import { useRouter } from 'next/navigation'

import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { IconsCollection } from '@/components/icons/radix-icons-collection'
import { getSession, handleLogout } from '@/actions/auth-actions'
import { useEffect, useState } from 'react'
import { User } from '@/types/user'
import { getUser } from '@/actions/user-actions'
import CreateAvatar from '@/lib/create-avatar'

const UserAvatar = () => {
  const router = useRouter()
  const [user, setUser] = useState<User>()

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getSession()

      if (res) {
        const data = await getUser(res?.user?.id)
        setUser(data?.data[0])
      }
    }

    fetchUser()
  }, [])

  return (
    <Popover>
      <PopoverTrigger>
        <Avatar className='aspect-square w-10 cursor-pointer bg-gray-200'>
          {user && (
            <CreateAvatar
              seed={`${user?.first_name || ''} ${user?.last_name || ''}`}
            />
          )}
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className='flex-center mx-6 my-2 w-80 flex-col gap-4 p-6'>
        <div className='flex-center flex-col gap-4 py-4'>
          <Avatar className='flex-center h-20 w-20 flex-col bg-gray-200'>
            {user && (
              <CreateAvatar
                seed={`${user?.first_name} ${user?.last_name}`}
                size={80}
              />
            )}
          </Avatar>
          <div className='flex-center flex-col gap-1'>
            <h1 className='text-center text-base font-medium'>
              {user?.first_name} {user?.last_name}
            </h1>
            <p className='text-sm font-normal lowercase text-foreground/60'>
              {user?.email}
            </p>
          </div>
        </div>
        <ul className='flex w-full flex-col border-t pt-4'>
          <li>
            <Button
              variant={'ghost'}
              className='w-full justify-start gap-4 text-sm font-normal'
              onClick={() => router.push('/dashboard')}
            >
              <IconsCollection icon={'DashboardIcon'} />
              Dashboard
            </Button>
          </li>
          <li>
            <Button
              variant={'ghost'}
              className='w-full justify-start gap-4 text-sm font-normal'
              onClick={() => handleLogout()}
            >
              <IconsCollection icon={'ExitIcon'} />
              ອອກຈາກລະບົບ
            </Button>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  )
}

export default UserAvatar
