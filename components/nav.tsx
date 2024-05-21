'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

interface NavProps {
  links: {
    title: string
    label?: string
    href: string
    icon: LucideIcon
  }[]
}

export function Nav({ links }: NavProps) {
  const pathname = usePathname()

  return (
    <div className='group flex flex-col gap-4 py-2'>
      <nav className='grid gap-1 px-2'>
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              pathname === link.href && 'bg-accent',
              'justify-start text-sm'
            )}
            prefetch={false}
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
