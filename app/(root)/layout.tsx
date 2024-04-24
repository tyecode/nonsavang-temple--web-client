'use client'

import LeftBar from '@/components/left-bar'
import TopBar from '@/components/top-bar'
import { Toaster } from '@/components/ui/toaster'

const HomePageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <aside className='w-[18rem] border bg-background'>
        <LeftBar />
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
