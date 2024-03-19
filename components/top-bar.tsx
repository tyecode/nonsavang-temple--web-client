'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

import { User } from '@/types/user'

import { getSession } from '@/actions/auth-actions'
import { getUser } from '@/actions/user-actions'

import UserAvatar from '@/components/user-avatar'
import { ModeToggle } from '@/components/mode-toggle'
import { Skeleton } from '@/components/ui/skeleton'

import { getTextFromPathname } from '@/lib/text-maps'

const TopBar = () => {
  const pathname = usePathname()
  const [user, setUser] = useState<User>()

  useEffect(() => {
    const fetchUser = async () => {
      const session = await getSession()

      if (session?.user?.id) {
        const { data } = await getUser(session.user.id)
        setUser(data[0])
      }
    }

    fetchUser()
  }, [pathname])

  return (
    <section className='w-full border bg-background'>
      <div className='container flex h-20 items-center justify-between md:container'>
        {pathname !== '/' ? (
          <span className='text-2xl font-bold capitalize text-foreground/80'>
            {getTextFromPathname(pathname)}
          </span>
        ) : (
          <div className='flex flex-col text-xs font-normal capitalize'>
            ຍິນດີຕ້ອນຮັບ,{' '}
            <span className='text-xl font-semibold'>
              {user ? (
                `${user.title} ${user.first_name} ${user.last_name}`
              ) : (
                <Skeleton className='mt-2 h-5 w-40' />
              )}
            </span>
          </div>
        )}

        <div className='flex items-center gap-4'>
          <ModeToggle />
          <UserAvatar user={user} />
        </div>
      </div>
    </section>
  )
}

export default TopBar
