'use client'

import { useEffect, useState } from 'react'

import { Spinner } from '@nextui-org/react'
import LeftBar from '@/components/left-bar'
import TopBar from '@/components/top-bar'
import { createClient } from '@/utils/supabase/client'
import { NavLinkGroup } from '@/types/nav-link'

const navLinkGroups: NavLinkGroup[] = [
  {
    id: 'group-1',
    links: [
      {
        id: 'overview',
        title: 'ພາບລວມ',
        href: '/overview',
      },
      {
        id: 'reports',
        title: 'ລາຍງານ',
        href: '/reports',
      },
    ],
  },
  {
    id: 'group-2',
    links: [
      {
        id: 'users',
        title: 'ຜູ້ໃຊ້',
        href: '/users',
      },
      {
        id: 'donators',
        title: 'ຜູ້ບໍລິຈາກ',
        href: '/donators',
      },
    ],
  },
  {
    id: 'group-3',
    links: [
      {
        id: 'incomes',
        title: 'ລາຍຮັບ',
        href: '/incomes',
      },
      {
        id: 'expenses',
        title: 'ລາຍຈ່າຍ',
        href: '/expenses',
      },
    ],
  },
]

const HomePageLayout = ({ children }: { children: React.ReactNode }) => {
  const supabase = createClient()
  const [isLoading, setLoadingState] = useState(true)

  return (
    <>
      {/* {isLoading && (
        <div className='flex-center absolute left-0 top-0 z-50 h-screen w-screen bg-background'>
          <Spinner size='lg' color='success' labelColor='success' />
        </div>
      )} */}

      <aside className='h-full w-[18rem] border bg-background'>
        <LeftBar navLinkGroups={navLinkGroups} />
      </aside>

      <main className='flex h-full w-full flex-col'>
        <TopBar />
        {children}
      </main>
    </>
  )
}

export default HomePageLayout
