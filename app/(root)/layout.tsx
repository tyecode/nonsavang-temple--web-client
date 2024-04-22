'use client'

import { NAV_LINK_DASHBOARD } from '@/constants/nav-link'

import LeftBar from '@/components/left-bar'
import TopBar from '@/components/top-bar'
import { Toaster } from '@/components/ui/toaster'

const HomePageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <aside className='w-[18rem] border bg-background'>
        <LeftBar navLinkGroups={NAV_LINK_DASHBOARD} />
      </aside>

      <main className='w-full overflow-auto'>
        <TopBar />
        {children}
        <Toaster />
      </main>
    </>
  )
}

export default HomePageLayout
