import { useEffect, useState } from 'react'
import { createAvatar } from '@dicebear/core'
import { initials } from '@dicebear/collection'
import Image from 'next/image'

const CreateAvatar = ({ seed, size = 40 }: { seed: string; size?: number }) => {
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
    <div
      className={`aspect-square w-[${size}px] overflow-hidden rounded-full bg-red-200`}
    >
      {svg && <Image src={svg} alt='avatar' width={size} height={size} />}
    </div>
  )
}

export default CreateAvatar
