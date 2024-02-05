'use client'

import { useRouter } from 'next/navigation'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { IconsCollection } from '@/components/icons/radix-icons-collection'
import { getAuth } from '@/actions/auth-actions'
import { useEffect, useState } from 'react'
// import { getUserOne } from '@/actions/users-actions'

const UserAvatar = () => {
  const router = useRouter()
  const [user, setUser] = useState<any>()

  // useEffect(() => {
  //   getAuth()
  //     .then((res) => res && getUserOne(res.user.id))
  //     .then((data) => data && setUser(data))
  // }, [])

  return (
    <Popover>
      <PopoverTrigger>
        <Avatar className='aspect-square w-10 cursor-pointer'>
          <AvatarImage src='' alt='user image' />
          <AvatarFallback>
            {user?.firstname?.slice(0, 1)}
            {user?.lastname?.slice(0, 1)}
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className='flex-center mx-6 my-2 w-80 flex-col gap-4 p-6'>
        <div className='flex-center flex-col gap-4 py-4'>
          <Avatar className='flex-center h-20 w-20 flex-col'>
            <AvatarImage src='' alt='user image' />
            <AvatarFallback className='text-4xl uppercase'>
              {user?.firstname?.slice(0, 1)}
              {user?.lastname?.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <div className='flex-center flex-col gap-1'>
            <h1 className='text-center text-base font-medium'>
              {user?.firstname} {user?.lastname}
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
            <form action='/api/logout' method='post'>
              <Button
                variant={'ghost'}
                className='w-full justify-start gap-4 text-sm font-normal'
              >
                <IconsCollection icon={'ExitIcon'} />
                ອອກຈາກລະບົບ
              </Button>
            </form>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  )
}

export default UserAvatar
