import { NavLinkGroup } from '@/types/nav-link'

export const NAV_LINK_ROOT: NavLinkGroup[] = [
  {
    id: 'group-1',
    links: [
      {
        id: 'overview',
        title: 'ພາບລວມ',
        href: '/overview',
      },
      {
        id: 'reports',
        title: 'ລາຍງານ',
        href: '/reports',
      },
    ],
  },
  {
    id: 'group-2',
    links: [
      {
        id: 'users',
        title: 'ຜູ້ໃຊ້',
        href: '/users',
      },
      {
        id: 'donators',
        title: 'ຜູ້ບໍລິຈາກ',
        href: '/donators',
      },
    ],
  },
  {
    id: 'group-3',
    links: [
      {
        id: 'incomes',
        title: 'ລາຍຮັບ',
        href: '/incomes',
      },
      {
        id: 'expenses',
        title: 'ລາຍຈ່າຍ',
        href: '/expenses',
      },
    ],
  },
]

export const NAV_LINK_DASHBOARD: NavLinkGroup[] = [
  {
    id: 'group-1',
    links: [
      {
        id: 'overview',
        title: 'ພາບລວມ',
        href: '/dashboard/overview',
        icon: 'chart-line-icon',
      },
      {
        id: 'reports',
        title: 'ລາຍງານ',
        href: '/dashboard/reports',
        icon: 'folder-closed-icon',
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
        icon: 'user-icon',
      },
      {
        id: 'donators',
        title: 'ຈັດການຜູ້ບໍລິຈາກ',
        href: '/dashboard/donators',
        icon: 'address-book-icon',
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
        icon: 'money-bill-icon',
      },
      {
        id: 'expenses',
        title: 'ຈັດການລາຍຈ່າຍ',
        href: '/dashboard/expenses',
        icon: 'credit-card-icon',
      },
      {
        id: 'income-categories',
        title: 'ຈັດການປະເພດລາຍຮັບ',
        href: '/dashboard/income-categories',
        icon: 'bar-staggered-left-icon',
      },
      {
        id: 'expense-categories',
        title: 'ຈັດການປະເພດລາຍຈ່າຍ',
        href: '/dashboard/expense-categories',
        icon: 'bar-staggered-right-icon',
      },
      {
        id: 'accounts',
        title: 'ຈັດການບັນຊີ',
        href: '/dashboard/accounts',
        icon: 'wallet-icon',
      },
      {
        id: 'currencies',
        title: 'ຈັດການສະກຸນເງິນ',
        href: '/dashboard/currencies',
        icon: 'dollar-sign-icon',
      },
    ],
  },
]
