'use client'

import { NAV_LINK_DASHBOARD } from '@/constants/nav-link'

import LeftBar from '@/components/left-bar'
import TopBar from '@/components/top-bar'
import { Toaster } from '@/components/ui/toaster'

const DashboardPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <aside className='h-full w-[18rem] border bg-background'>
        <LeftBar navLinkGroups={NAV_LINK_DASHBOARD} />
      </aside>

      <main className='flex h-full w-full flex-col'>
        <TopBar />
        {children}
        <Toaster />
      </main>
    </>
  )
}

export default DashboardPageLayout
