import { useEffect, useState } from 'react'
import { createAvatar } from '@dicebear/core'
import { initials } from '@dicebear/collection'
import Image from 'next/image'

const CreateAvatar = ({ seed }: { seed: string }) => {
  const [svg, setSvg] = useState<string>('')

  useEffect(() => {
    const getAvatar = async () => {
      const avatar = createAvatar(initials, {
        seed,
        fontSize: 40,
        fontWeight: 500,
      })
      const svg = await avatar.toDataUri()
      setSvg(svg)
    }

    getAvatar()
  }, [seed])

  return (
    <div className='aspect-square w-10 overflow-hidden rounded-full bg-red-200'>
      {svg && <Image src={svg} alt='avatar' width={48} height={48} />}
    </div>
  )
}

export default CreateAvatar
