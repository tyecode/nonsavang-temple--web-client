'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { IconsCollection } from '@/components/icons/icons-collection'
import { NavLink, NavLinkGroup } from '@/types/nav-link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useRouter } from 'next/navigation'

const LeftBar = ({ navLinkGroups }: { navLinkGroups: NavLinkGroup[] }) => {
  const pathname = usePathname()
  const router = useRouter()

  const navActive = navLinkGroups.find((group) =>
    group.links.find((link) => link.href === pathname)
  )

  const NavLinkButton: React.FC<{ link: NavLink }> = ({ link }) => {
    useEffect(() => {
      router.prefetch(link.href)
    }, [link.href, router])

    return (
      <Button
        key={link.id}
        variant={'ghost'}
        size={'sm'}
        className={cn(
          'group flex w-full items-center justify-start gap-4 text-foreground',
          link.href === pathname ? 'bg-accent' : ''
        )}
        onClick={() => router.push(link.href)}
      >
        <IconsCollection icon={link.icon || ''} />
        {link.title}
      </Button>
    )
  }

  return (
    <nav className='h-full w-full overflow-scroll'>
      <div className='flex-center w-full pt-4'>
        <Image
          src={`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_PATH}/logo.png`}
          alt={'logo'}
          width={72}
          height={72}
          className='cursor-pointer object-cover'
          onClick={() => router.push('/')}
          draggable={false}
          priority
        />
      </div>
      <Accordion
        type='multiple'
        defaultValue={[navActive?.id || '']}
        className='w-full px-6 py-4 font-noto-lao'
      >
        {navLinkGroups.map((group: NavLinkGroup) => (
          <AccordionItem key={group.id} value={group.id}>
            <AccordionTrigger className='text-sm hover:no-underline'>
              {group.title}
            </AccordionTrigger>
            <AccordionContent>
              <div className='flex flex-col'>
                {group.links.map((link: NavLink) => (
                  <NavLinkButton key={link.id} link={link} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </nav>
  )
}

export default LeftBar
