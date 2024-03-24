'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  const router = useRouter()

  useEffect(() => {
    router.prefetch('/')
  }, [])

  return (
    <div className='absolute left-1/2 top-1/2 mb-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center'>
      <span className='bg-gradient-to-b from-foreground to-transparent bg-clip-text text-[8rem] font-extrabold leading-none text-transparent'>
        404
      </span>
      <h2 className='font-heading my-2 text-2xl font-bold'>
        ບໍ່ພົບໜ້າເວັບໄຊທີ່ທ່ານຄົ້ນຫາ
      </h2>
      <p>
        ໜ້າເວັບໄຊທີ່ທ່ານກຳລັງຄົ້ນຫາອາດຈະຖີກລຶບ, ຖືກແກ້ໄຂຊື່ ຫຼື
        ມີການປິດໃຫ້ບໍລິການຊົ່ວຄາວ.
      </p>
      <div className='mt-8 flex justify-center gap-2'>
        <Button onClick={() => router.push('/')} variant='default' size='sm'>
          ກັບໄປຍັງໜ້າຫຼັກ
        </Button>
      </div>
    </div>
  )
}
