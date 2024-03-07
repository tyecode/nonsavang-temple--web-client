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
        title: 'Overview',
        href: '/overview',
      },
      {
        id: 'expenses',
        title: 'Expenses',
        href: '/expenses',
      },
      {
        id: 'incomes',
        title: 'Incomes',
        href: '/incomes',
      },
      {
        id: 'reports',
        title: 'Reports',
        href: '/reports',
      },
      {
        id: 'settings',
        title: 'Settings',
        href: '/settings',
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
