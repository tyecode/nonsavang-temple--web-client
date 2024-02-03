'use client'

import LeftBar from '@/components/left-bar'
import TopBar from '@/components/top-bar'
import { Toaster } from '@/components/ui/toaster'

const dashboard = [
  {
    id: 1,
    title: 'Dashboard',
    link: '/dashboard/users',
  },
  {
    id: 2,
    title: 'ລາຍງານ',
    link: '/dashboard/reports',
  },
  {
    id: 3,
    title: 'ຈັດການລາຍຈ່າຍ',
    link: '/dashboard/expenses',
  },
  {
    id: 4,
    title: 'ຈັດການລາຍຮັບ',
    link: '/dashboard/incomes',
  },
  {
    id: 5,
    title: 'ຈັດການປະເພດລາຍຮັບ',
    link: '/dashboard/incomes/category',
  },
  {
    id: 6,
    title: 'ຈັດການບັນຊີ',
    link: '/dashboard/accounts',
  },
  {
    id: 7,
    title: 'Users',
    link: '/dashboard/users',
  },
  {
    id: 8,
    title: 'Setting',
    link: '/dashboard/settings',
  },
]

const DashboardPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <aside className='h-full w-[20rem] border bg-background'>
        <LeftBar navLinks={dashboard} />
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
