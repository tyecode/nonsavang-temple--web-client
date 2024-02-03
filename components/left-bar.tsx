'use client'

import { Button } from '@/components/ui/button'
import { IconsCollection } from '@/components/icons/radix-icons-collection'
import { useRouter } from 'next/navigation'

const LeftBar = ({ navLinks }: any) => {
  const router = useRouter()
  return (
    <nav className='px-8'>
      <h1
        onClick={() => router.push('/')}
        className='cursor-pointer px-4 py-6 font-nunito text-2xl font-bold text-foreground'
      >
        Abbeyard
      </h1>
      <ul className='flex flex-col border-t py-4 font-noto-lao'>
        {navLinks.map((link: any) => (
          <li key={link.id}>
            <Button
              variant={'ghost'}
              size={'sm'}
              className='group flex w-full items-center justify-start gap-4 text-foreground'
              onClick={() => router.push(link.link)}
            >
              <IconsCollection icon={link.icon} />
              {link.title}
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default LeftBar
