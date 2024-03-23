'use client'

import { useEffect, useTransition } from 'react'
import { usePathname } from 'next/navigation'

import { getSession } from '@/actions/auth-actions'
import { getUser } from '@/actions/user-actions'

import UserAvatar from '@/components/user-avatar'
import { ModeToggle } from '@/components/mode-toggle'
import { Skeleton } from '@/components/ui/skeleton'

import { getTextFromPathname } from '@/lib/text-maps'
import { useAuthStore } from '@/stores'

const TopBar = () => {
  const pathname = usePathname()
  const user = useAuthStore((state) => state.auth)
  const setUser = useAuthStore((state) => state.setAuth)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        startTransition(async () => {
          const session = await getSession()

          if (!session?.user?.id) return

          const { data } = await getUser(session.user.id)

          setUser(data[0])
        })
      } catch (error) {}
    }

    if (user.display_name !== undefined) return

    fetchUser()
  }, [pathname, setUser, user])

  return (
    <section className='w-full border bg-background'>
      <div className='container flex h-20 items-center justify-between md:container'>
        {pathname !== '/' && pathname !== '/dashboard' ? (
          <span className='text-2xl font-bold capitalize text-foreground/80'>
            {getTextFromPathname(pathname)}
          </span>
        ) : (
          <div className='flex flex-col text-xs font-normal capitalize'>
            ຍິນດີຕ້ອນຮັບ,{' '}
            <span className='text-xl font-semibold'>
              {!isPending ? (
                `${user.title} ${user.first_name} ${user.last_name}`
              ) : (
                <Skeleton className='mt-2 h-5 w-40' />
              )}
            </span>
          </div>
        )}

        <div className='flex items-center gap-4'>
          <ModeToggle />
          <UserAvatar user={user} loading={isPending} />
        </div>
      </div>
    </section>
  )
}

export default TopBar
