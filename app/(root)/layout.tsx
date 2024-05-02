'use client'

import { LeftBar, TopBar } from '@/layouts'
import { Toaster } from '@/components/ui/toaster'

const HolderPageLayout = ({ children }: { children: React.ReactNode }) => {
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

export default HolderPageLayout
