import Image from 'next/image'

import { useEffect, useState } from 'react'

import { createAvatar } from '@dicebear/core'
import { initials } from '@dicebear/collection'

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  seed: string
  src?: string
  size?: number
  className?: string
}

const CreateAvatar = ({
  seed,
  src,
  size = 40,
  className,
  ...rest
}: AvatarProps) => {
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

  return src ? (
    <div
      className={`aspect-square w-[${size.toString()}px] relative overflow-hidden rounded-full ${className}`}
      {...rest}
    >
      <Image
        src={src}
        alt={`avatar-${seed}`}
        className='object-cover'
        width={size}
        height={size}
        priority
      />
    </div>
  ) : (
    <div
      className={`aspect-square w-[${size.toString()}px] overflow-hidden rounded-full ${className}`}
      {...rest}
    >
      {svg && (
        <Image src={svg} alt={`avatar-${seed}`} width={size} height={size} />
      )}
    </div>
  )
}

export default CreateAvatar
