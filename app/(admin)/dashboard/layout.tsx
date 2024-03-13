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
        id: 'overview',
        title: 'ພາບລວມ',
        href: '/dashboard/overview',
      },
      {
        id: 'reports',
        title: 'ລາຍງານ',
        href: '/dashboard/reports',
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
      {
        id: 'approvals',
        title: 'ຈັດການການອະນຸມັດ',
        href: '/dashboard/approvals',
      },
    ],
  },
  {
    id: 'group-3',
    links: [
      {
        id: 'incomes',
        title: 'ຈັດການລາຍຮັບ',
        href: '/dashboard/incomes',
      },
      {
        id: 'expenses',
        title: 'ຈັດການລາຍຈ່າຍ',
        href: '/dashboard/expenses',
      },
      {
        id: 'income-categories',
        title: 'ຈັດການປະເພດລາຍຮັບ',
        href: '/dashboard/income-categories',
      },
      {
        id: 'expense-categories',
        title: 'ຈັດການປະເພດລາຍຈ່າຍ',
        href: '/dashboard/expense-categories',
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
