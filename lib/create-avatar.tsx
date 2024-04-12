import { useEffect, useState } from 'react'
import { createAvatar } from '@dicebear/core'
import { initials } from '@dicebear/collection'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { cn } from './utils'

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  seed: string
  src?: string
  className?: string
}

export const CreateAvatar = ({
  seed,
  src,
  className,
  ...rest
}: AvatarProps) => {
  const [svg, setSvg] = useState<string>('')

  useEffect(() => {
    const avatar = createAvatar(initials, {
      seed,
      fontSize: 40,
      fontWeight: 500,
    })
    avatar.toDataUri().then(setSvg)
  }, [seed])

  const defaultImage = '/logo.png'

  return (
    <Avatar className={className} {...rest}>
      <AvatarImage
        src={src || svg}
        alt={`avatar[${seed}]`}
        className='h-full w-full object-cover'
      />
    </Avatar>
  )
}
