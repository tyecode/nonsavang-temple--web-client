import { Badge } from './ui/badge'

type Status = 'PENDING' | 'APPROVED' | 'REJECTED'

type BadgeVariant = 'warning' | 'success' | 'danger'

type StatusProps = {
  status: Status | string
}

type StatusMap = {
  [key in Status]: { variant: BadgeVariant; text: string }
}

export const StatusBadge = ({ status }: StatusProps) => {
  const statusMap: StatusMap = {
    PENDING: { variant: 'warning', text: 'ລໍຖ້າການອະນຸມັດ' },
    APPROVED: { variant: 'success', text: 'ອະນຸມັດແລ້ວ' },
    REJECTED: { variant: 'danger', text: 'ຖືກປະຕິເສດ' },
  }

  const { variant, text } = statusMap[status as Status] || {}

  return (
    variant && (
      <Badge
        variant={variant}
        className='whitespace-nowrap font-medium text-background'
      >
        {text}
      </Badge>
    )
  )
}
