'use client'

import Image from 'next/image'

import { Nav } from '@/components/nav'
import { Separator } from '@/components/ui/separator'

import {
  TrendingUp,
  TrendingDown,
  AlignRight,
  AlignLeft,
  CreditCard,
  DollarSign,
  User,
  Home,
  FileBarChart,
  FileBarChart2,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  Box,
  Clock,
} from 'lucide-react'
import { useAuthStore } from '@/stores'

export default function LeftBar() {
  const user = useAuthStore((state) => state.auth)

  const rootLinks = [
    {
      title: 'ຫນ້າຫຼັກ',
      href: '/',
      icon: Home,
    },
  ]

  if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
    rootLinks.push(
      {
        title: 'ຈັດການລາຍຮັບ',
        href: '/incomes',
        icon: TrendingUp,
      },
      {
        title: 'ຈັດການລາຍຈ່າຍ',
        href: '/expenses',
        icon: TrendingDown,
      }
    )
  }

  return (
    <div className='relative h-screen w-full overflow-y-auto'>
      <div className='flex-center mb-4 w-full pt-4'>
        <Image
          src={`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_PATH}/logo.png`}
          alt={'logo'}
          width={72}
          height={72}
          className='object-cover'
          draggable={false}
          priority
        />
      </div>
      <Nav links={rootLinks} />
      <Separator />
      {user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? (
        <>
          <Nav
            links={[
              {
                title: 'ຈັດການຜູ້ໃຊ້',
                href: '/users',
                icon: User,
              },
              {
                title: 'ຈັດການຜູ້ບໍລິຈາກ',
                href: '/donators',
                icon: Box,
              },
              {
                title: 'ຈັດການປະເພດລາຍຮັບ',
                href: '/income-categories',
                icon: AlignRight,
              },
              {
                title: 'ຈັດການປະເພດລາຍຈ່າຍ',
                href: '/expense-categories',
                icon: AlignLeft,
              },
              {
                title: 'ຈັດການບັນຊີ',
                href: '/accounts',
                icon: CreditCard,
              },
              {
                title: 'ຈັດການສະກຸນເງິນ',
                href: '/currencies',
                icon: DollarSign,
              },
            ]}
          />
          <Separator />
        </>
      ) : null}
      {user.role === 'HOLDER' || user.role === 'SUPER_ADMIN' ? (
        <>
          <Nav
            links={[
              {
                title: 'ລາຍການທີ່ລໍຖ້າອະນຸມັດ',
                href: '/pending',
                icon: Clock,
              },
              {
                title: 'ລາຍການທີ່ອະນຸມັດແລ້ວ',
                href: '/approved',
                icon: CheckCircle,
              },
              {
                title: 'ລາຍການທີ່ຖືກປະຕິເສດ',
                href: '/rejected',
                icon: XCircle,
              },
            ]}
          />
          <Separator />
        </>
      ) : null}
      <Nav
        links={[
          {
            title: 'ລາຍງານບັນຊີ',
            href: '/report-account',
            icon: FileBarChart2,
          },
          {
            title: 'ລາຍງານລາຍຮັບ-ລາຍຈ່າຍ',
            href: '/report-income-expense',
            icon: FileBarChart,
          },
          {
            title: 'ລາຍງານຜູ້ບໍລິຈາກ',
            href: '/report-donator',
            icon: FileSpreadsheet,
          },
        ]}
      />
    </div>
  )
}
