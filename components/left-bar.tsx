'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { IconsCollection } from '@/components/icons/radix-icons-collection'
import { NavLink, NavLinkGroup } from '@/types/nav-link'

const LeftBar = ({ navLinkGroups }: { navLinkGroups: NavLinkGroup[] }) => {
  const NavLinkButton: React.FC<{ link: NavLink }> = ({ link }) => (
    <li key={link.id}>
      <Link href={link.href}>
        <Button
          variant={'ghost'}
          size={'sm'}
          className='group flex w-full items-center justify-start gap-4 text-foreground'
        >
          <IconsCollection icon={link.icon || ''} />
          {link.title}
        </Button>
      </Link>
    </li>
  )

  const Divider = () => (
    <li>
      <div className='my-2 w-full border-t'></div>
    </li>
  )

  return (
    <nav>
      <div className='flex-center w-full p-4'>
        <Link href='/'>
          <Image
            src={'/logo.png'}
            alt={'logo'}
            width={86}
            height={86}
            className='object-cover'
            priority
          />
        </Link>
      </div>
      <ul className='flex flex-col px-6 py-4 font-noto-lao'>
        {navLinkGroups.map((group: NavLinkGroup, index: number) => (
          <React.Fragment key={`group-${group.id}`}>
            {group.links.map((link: NavLink) => (
              <NavLinkButton key={link.id} link={link} />
            ))}
            {navLinkGroups.length !== index + 1 && (
              <Divider key={`divider-${group.id}`} />
            )}
          </React.Fragment>
        ))}
      </ul>
    </nav>
  )
}

export default LeftBar
