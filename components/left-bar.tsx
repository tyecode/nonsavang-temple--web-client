'use client'

import React, { useEffect } from 'react'

import Image from 'next/image'
import { useRouter } from 'next/router'

import { Nav } from '@/components/nav'
import { Separator } from '@/components/ui/separator'

import {
  Archive,
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
} from 'lucide-react'

const LeftBar = () => {
  const router = useRouter()

  return (
    <div className='h-full w-full overflow-scroll'>
      <div className='flex-center mb-4 w-full pt-4'>
        <Image
          src={`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_PATH}/logo.png`}
          alt={'logo'}
          width={72}
          height={72}
          className='cursor-pointer object-cover'
          onClick={() => router.push('/')}
          draggable={false}
          priority
        />
      </div>
      <Nav
        isCollapsed={false}
        links={[
          {
            title: 'ຫນ້າຫຼັກ',
            href: '/',
            icon: Home,
          },
          {
            title: 'ຈັດການລາຍຮັບ',
            href: '/incomes',
            icon: TrendingUp,
          },
          {
            title: 'ຈັດການລາຍຈ່າຍ',
            href: '/expenses',
            icon: TrendingDown,
          },
        ]}
      />
      <Separator />
      <Nav
        isCollapsed={false}
        links={[
          {
            title: 'ຈັດການຜູ້ໃຊ້',
            href: '/users',
            icon: User,
          },
          {
            title: 'ຈັດການຜູ້ບໍລິຈາກ',
            href: '/donators',
            icon: Archive,
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
      <Nav
        isCollapsed={false}
        links={[
          {
            title: 'ລາຍງານລາຍຮັບ',
            href: '/report-incomes',
            icon: FileBarChart,
          },
          {
            title: 'ລາຍງານລາຍຈ່າຍ',
            href: '/report-expenses',
            icon: FileBarChart2,
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

export default LeftBar
