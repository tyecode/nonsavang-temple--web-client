'use client'

import React from 'react'
import Link from 'next/link'

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
    <nav className='px-8'>
      <Link href='/'>
        <h1 className='cursor-pointer px-4 py-6 font-nunito text-2xl font-bold text-foreground'>
          Abbeyard
        </h1>
      </Link>
      <ul className='flex flex-col border-t py-4 font-noto-lao'>
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
