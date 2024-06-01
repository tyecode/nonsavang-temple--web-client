'use client'

import { usePathname, useRouter } from 'next/navigation'

import { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'

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
  const router = useRouter()

  return (
    <div className='group flex flex-col gap-4 py-2'>
      <nav className='grid gap-1 px-2'>
        {links.map((link, index) => (
          <Button
            key={index}
            variant='ghost'
            size='sm'
            className={cn(
              pathname === link.href && 'bg-accent',
              'justify-start text-sm'
            )}
            onClick={() => {
              router.refresh()
              router.push(link.href)
            }}
          >
            <link.icon className='mr-2 h-4 w-4' />
            {link.title}
            {link.label && <span className='ml-auto'>{link.label}</span>}
          </Button>
        ))}
      </nav>
    </div>
  )
}
