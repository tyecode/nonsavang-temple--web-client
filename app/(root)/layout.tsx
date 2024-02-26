'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { Spinner } from '@nextui-org/react'
import { navLinks } from '@/constants'
import LeftBar from '@/components/left-bar'
import TopBar from '@/components/top-bar'
import { createClient } from '@/utils/supabase/client'

const HomePageLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
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
        {/* <LeftBar navLinks={navLinks} /> */}
      </aside>

      <main className='flex h-full w-full flex-col'>
        <TopBar />
        {children}
      </main>
    </>
  )
}

export default HomePageLayout
