'use client'

import { NAV_LINK_ROOT } from '@/constants/nav-link'

import LeftBar from '@/components/left-bar'
import TopBar from '@/components/top-bar'

const HomePageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <aside className='h-full w-[18rem] border bg-background'>
        <LeftBar navLinkGroups={NAV_LINK_ROOT} />
      </aside>

      <main className='flex h-full w-full flex-col'>
        <TopBar />
        {children}
      </main>
    </>
  )
}

export default HomePageLayout
