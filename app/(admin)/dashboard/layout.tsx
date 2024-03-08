'use client'

import LeftBar from '@/components/left-bar'
import TopBar from '@/components/top-bar'
import { Toaster } from '@/components/ui/toaster'
import { NavLinkGroup } from '@/types/nav-link'

const navLinkGroups: NavLinkGroup[] = [
  {
    id: 'group-1',
    links: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        href: '/dashboard/users',
      },
    ],
  },
  {
    id: 'group-2',
    links: [
      {
        id: 'users',
        title: 'ຈັດການຜູ້ໃຊ້',
        href: '/dashboard/users',
      },
      {
        id: 'donators',
        title: 'ຈັດການຜູ້ບໍລິຈາກ',
        href: '/dashboard/donators',
      },
    ],
  },
  {
    id: 'group-3',
    links: [
      {
        id: 'reports',
        title: 'ລາຍງານ',
        href: '/dashboard/reports',
      },
      {
        id: 'expenses',
        title: 'ຈັດການລາຍຈ່າຍ',
        href: '/dashboard/expenses',
      },
      {
        id: 'incomes',
        title: 'ຈັດການລາຍຮັບ',
        href: '/dashboard/incomes',
      },
      {
        id: 'incomes-category',
        title: 'ຈັດການປະເພດລາຍຮັບ',
        href: '/dashboard/incomes/category',
      },
      {
        id: 'accounts',
        title: 'ຈັດການບັນຊີ',
        href: '/dashboard/accounts',
      },
      {
        id: 'currencies',
        title: 'ຈັດການສະກຸນເງິນ',
        href: '/dashboard/currencies',
      },
    ],
  },
]

const DashboardPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <aside className='h-full w-[20rem] border bg-background'>
        <LeftBar navLinkGroups={navLinkGroups} />
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
