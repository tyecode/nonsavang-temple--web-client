'use client'

import { usePathname } from 'next/navigation'

import { ModeToggle } from '@/components/mode-toggle'
import UserAvatar from './user-avatar'

const TopBar = () => {
  const pathname = usePathname()
  const title = pathname.split('/')[1]

  return (
    <section className='w-full border bg-background'>
      <div className='container flex h-20 items-center justify-between md:container'>
        {pathname !== '/' ? (
          <span className='text-2xl font-bold capitalize text-foreground/80'>
            {title}
          </span>
        ) : (
          <div className='flex flex-col text-xs font-normal capitalize'>
            Welcome back,{' '}
            <span className='text-xl font-semibold'>Sengphachanh</span>
          </div>
        )}

        <div className='flex items-center gap-4'>
          <ModeToggle />
          <UserAvatar />
        </div>
      </div>
    </section>
  )
}

export default TopBar
