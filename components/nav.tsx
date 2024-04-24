'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

interface NavProps {
  isCollapsed: boolean
  links: {
    title: string
    label?: string
    href: string
    icon: LucideIcon
  }[]
}

export function Nav({ links, isCollapsed }: NavProps) {
  const pathname = usePathname()

  return (
    <div
      data-collapsed={isCollapsed}
      className='group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2'
    >
      <nav className='grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2'>
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              pathname === link.href && 'bg-accent',
              'justify-start'
            )}
          >
            <link.icon className='mr-2 h-4 w-4' />
            {link.title}
            {link.label && <span className='ml-auto'>{link.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  )
}
