'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { IconsCollection } from '@/components/icons/radix-icons-collection'
import { useRouter } from 'next/navigation'
import { Link, NavLinkGroup } from '@/types/nav-links'

const LeftBar = ({ navLinkGroups }: { navLinkGroups: NavLinkGroup[] }) => {
  const router = useRouter()

  const NavLinkButton: React.FC<{ link: Link }> = ({ link }) => (
    <li key={link.id}>
      <Button
        variant={'ghost'}
        size={'sm'}
        className='group flex w-full items-center justify-start gap-4 text-foreground'
        onClick={() => router.push(link.href)}
      >
        <IconsCollection icon={link.icon || ''} />
        {link.title}
      </Button>
    </li>
  )

  const Divider = () => (
    <li>
      <div className='my-2 w-full border-t'></div>
    </li>
  )

  return (
    <nav className='px-8'>
      <h1
        onClick={() => router.push('/')}
        className='cursor-pointer px-4 py-6 font-nunito text-2xl font-bold text-foreground'
      >
        Abbeyard
      </h1>
      <ul className='flex flex-col border-t py-4 font-noto-lao'>
        {navLinkGroups.map((group: NavLinkGroup, index: number) => (
          <React.Fragment key={`group-${group.id}`}>
            {group.links.map((link: Link) => (
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
