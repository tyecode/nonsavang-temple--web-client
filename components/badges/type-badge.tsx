import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

type Type = 'Income' | 'Expense'

type TypeProps = {
  status: Type | string
}

type TypeMap = {
  [key in Type]: {
    text: string
    className: string
  }
}

const typeMap: TypeMap = {
  Income: {
    text: 'ລາຍຮັບ',
    className: 'border-success text-success bg-success bg-opacity-10',
  },
  Expense: {
    text: 'ລາຍຈ່າຍ',
    className: 'border-danger text-danger bg-danger bg-opacity-10',
  },
}

export const TypeBadge = ({ status }: TypeProps) => {
  const { text, className } = typeMap[status as Type]

  return (
    <Badge
      variant={'outline'}
      className={cn('whitespace-nowrap border text-xs font-medium', className)}
    >
      {text}
    </Badge>
  )
}
