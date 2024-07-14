'use client'

import { useEffect } from 'react'
import { redirect } from 'next/navigation'
import { useCookies } from 'next-client-cookies'

import { Toaster } from '@/components/ui/toaster'
import { LeftBar, TopBar } from '@/layouts'

export default function AdminPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookies = useCookies()
  const token = JSON.parse(cookies.get('nonsavang-user-data') || '{}')

  useEffect(() => {
    if (token && !['ADMIN', 'SUPER_ADMIN'].includes(token.role)) {
      redirect('/404')
    }
  }, [token])

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
