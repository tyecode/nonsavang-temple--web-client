'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const AdminApprovals = () => {
  return (
    <section className='container'>
      <Tabs defaultValue='account' className='mt-4 w-full'>
        <TabsList>
          <TabsTrigger value='account'>Account</TabsTrigger>
          <TabsTrigger value='password'>Password</TabsTrigger>
        </TabsList>
        <TabsContent value='account'>
          <div className='flex h-full flex-col gap-2 overflow-y-scroll'>
            <div className='h-14 w-full rounded-lg bg-gray-200'></div>
            <div className='h-14 w-full rounded-lg bg-gray-200'></div>
            <div className='h-14 w-full rounded-lg bg-gray-200'></div>
            <div className='h-14 w-full rounded-lg bg-gray-200'></div>
            <div className='h-14 w-full rounded-lg bg-gray-200'></div>
            <div className='h-14 w-full rounded-lg bg-gray-200'></div>
            <div className='h-14 w-full rounded-lg bg-gray-200'></div>
            <div className='h-14 w-full rounded-lg bg-gray-200'></div>
            <div className='h-14 w-full rounded-lg bg-gray-200'></div>
            <div className='h-14 w-full rounded-lg bg-gray-200'></div>
            <div className='h-14 w-full rounded-lg bg-gray-200'></div>
            <div className='h-14 w-full rounded-lg bg-gray-200'></div>
          </div>
        </TabsContent>
        <TabsContent value='password'>Change your password here.</TabsContent>
      </Tabs>
    </section>
  )
}

export default AdminApprovals
