import { NavLinkGroup } from '@/types/nav-link'

export const NAV_LINK_ROOT: NavLinkGroup[] = [
  {
    id: 'group-1',
    title: 'ຫນ້າຫຼັກ',
    links: [
      {
        id: 'overview',
        title: 'ພາບລວມ',
        href: '/',
        icon: 'pie-chart-icon',
      },
      {
        id: 'incomes',
        title: 'ລາຍຮັບ',
        href: '/incomes',
        icon: 'trending-up-icon',
      },
      {
        id: 'expenses',
        title: 'ລາຍຈ່າຍ',
        href: '/expenses',
        icon: 'trending-down-icon',
      },
      {
        id: 'donators',
        title: 'ຜູ້ບໍລິຈາກ',
        href: '/donators',
        icon: 'archive-icon',
      },
    ],
  },
]

export const NAV_LINK_DASHBOARD: NavLinkGroup[] = [
  {
    id: 'group-1',
    title: 'ຫນ້າຫຼັກ',
    links: [
      {
        id: 'overview',
        title: 'ພາບລວມ',
        href: '/dashboard',
        icon: 'pie-chart-icon',
      },
      {
        id: 'incomes',
        title: 'ລາຍຮັບ',
        href: '/incomes',
        icon: 'trending-up-icon',
      },
      {
        id: 'expenses',
        title: 'ລາຍຈ່າຍ',
        href: '/expenses',
        icon: 'trending-down-icon',
      },
      {
        id: 'donators',
        title: 'ຜູ້ບໍລິຈາກ',
        href: '/donators',
        icon: 'archive-icon',
      },
    ],
  },
  {
    id: 'group-2',
    title: 'ຈັດການຂໍ້ມູນ',
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
        icon: 'archive-icon',
      },
      {
        id: 'incomes',
        title: 'ຈັດການລາຍຮັບ',
        href: '/dashboard/incomes',
        icon: 'trending-up-icon',
      },
      {
        id: 'expenses',
        title: 'ຈັດການລາຍຈ່າຍ',
        href: '/dashboard/expenses',
        icon: 'trending-down-icon',
      },
      {
        id: 'income-categories',
        title: 'ຈັດການປະເພດລາຍຮັບ',
        href: '/dashboard/income-categories',
        icon: 'align-right-icon',
      },
      {
        id: 'expense-categories',
        title: 'ຈັດການປະເພດລາຍຈ່າຍ',
        href: '/dashboard/expense-categories',
        icon: 'align-left-icon',
      },
      {
        id: 'accounts',
        title: 'ຈັດການບັນຊີ',
        href: '/dashboard/accounts',
        icon: 'credit-card-icon',
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
