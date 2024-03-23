'use client'

import React, { forwardRef } from 'react'
import Link from 'next/link'
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

type LinkButtonProps = {
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
  href?: string
  isPending?: boolean
  title: string
  icon: string | undefined
}

const LeftBar = ({ navLinkGroups }: { navLinkGroups: NavLinkGroup[] }) => {
  const pathname = usePathname()

  const navActive = navLinkGroups.find((group) =>
    group.links.find((link) => link.href === pathname)
  )

  const NavLinkButton: React.FC<{ link: NavLink }> = ({ link }) => (
    <Link
      key={link.id}
      href={link.href}
      prefetch={false}
      passHref
      legacyBehavior
    >
      <LinkButton title={link.title} icon={link.icon} />
    </Link>
  )

  const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
    ({ onClick, href, isPending, title, icon }, ref) => {
      return (
        <a href={href} onClick={onClick} ref={ref}>
          <Button
            variant={'ghost'}
            size={'sm'}
            className={cn(
              'group flex w-full items-center justify-start gap-4 text-foreground',
              href === pathname ? 'bg-accent' : ''
            )}
          >
            <IconsCollection icon={icon || ''} />
            {title}
          </Button>
        </a>
      )
    }
  )

  LinkButton.displayName = 'LinkButton'

  return (
    <nav className='h-full w-full overflow-scroll'>
      <div className='flex-center w-full pt-4'>
        <Link href='/' prefetch={false}>
          <Image
            src={`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_PATH}/logo.png`}
            alt={'logo'}
            width={72}
            height={72}
            className='object-cover'
            draggable={false}
            priority
          />
        </Link>
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
