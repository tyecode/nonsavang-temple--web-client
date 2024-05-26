'use client'

import { useEffect, useTransition } from 'react'
import { usePathname } from 'next/navigation'
import { useCookies } from 'next-client-cookies'

import { getUser } from '@/actions/user-actions'

import UserAvatar from '@/components/user-avatar'
import { ModeToggle } from '@/components/mode-toggle'
import { Skeleton } from '@/components/ui/skeleton'

import { getTextFromPathname } from '@/lib/text-maps'
import { useAuthStore } from '@/stores'

const TopBar = () => {
  const [isPending, startTransition] = useTransition()

  const setUser = useAuthStore((state) => state.setAuth)
  const user = useAuthStore((state) => state.auth)

  const pathname = usePathname()
  const cookies = useCookies()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        startTransition(async () => {
          const cookieName = process.env.NEXT_PUBLIC_SUPABASE_AUTH_COOKIE_NAME!
          const cookieData = cookies.get(cookieName) ?? ''
          const session = JSON.parse(cookieData)

          if (!session?.user?.id) return

          const { data } = await getUser(session.user.id)

          if (data) setUser(data[0])
        })
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }

    if (user.display_name !== undefined) return

    fetchUser()
  }, [pathname, setUser, user])

  return (
    <section className='sticky top-0 z-50 w-full border-b bg-background'>
      <div className='container flex h-16 items-center justify-between md:container'>
        {pathname !== '/' ? (
          <span className='text-xl font-bold capitalize text-foreground/80'>
            {pathname && getTextFromPathname(pathname)}
          </span>
        ) : (
          <div className='flex flex-col'>
            <span className='-mb-1 text-xs font-medium'>ຍິນດີຕ້ອນຮັບ,</span>
            <span className='text-lg font-semibold'>
              {!isPending ? (
                <span>{user.display_name}</span>
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
