import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

type Status = 'PENDING' | 'APPROVED' | 'REJECTED'

type StatusProps = {
  status: Status | string
}

type StatusMap = {
  [key in Status]: {
    text: string
    className: string
  }
}

const statusMap: StatusMap = {
  PENDING: {
    text: 'ລໍຖ້າການອະນຸມັດ',
    className: 'border-warning text-warning bg-warning bg-opacity-10',
  },
  APPROVED: {
    text: 'ອະນຸມັດແລ້ວ',
    className: 'border-success text-success bg-success bg-opacity-10',
  },
  REJECTED: {
    text: 'ຖືກປະຕິເສດ',
    className: 'border-danger text-danger bg-danger bg-opacity-10',
  },
}

export const StatusBadge = ({ status }: StatusProps) => {
  const { text, className } = statusMap[status as Status]

  return (
    status && (
      <Badge
        variant={'outline'}
        className={cn(
          'whitespace-nowrap border text-xs font-medium',
          className
        )}
      >
        {text}
      </Badge>
    )
  )
}
