import React from 'react'
import { Input } from './ui/input'

interface MonetaryInputProps {
  value: number | string
  isPending: boolean
  isNegative?: boolean
  onChange: (value: number | string) => void
  [x: string]: any
}

const MonetaryInput = React.forwardRef<HTMLInputElement, MonetaryInputProps>(
  function MonetaryInput(
    { value, isPending, onChange, isNegative, ...rest },
    ref
  ) {
    return (
      <Input
        ref={ref}
        type='text'
        value={
          value.toString() === '0' || !isNegative
            ? Math.abs(Number(value)).toLocaleString()
            : '-' + Math.abs(Number(value)).toLocaleString()
        }
        disabled={isPending}
        onChange={(event: any) => {
          let value = event.target.value.replace(/[^0-9]/g, '')

          if (value === '') {
            onChange(0)
          } else if (value.startsWith('0')) {
            if (value === '0') {
              onChange(0)
            } else {
              onChange(value.slice(1))
            }
          } else {
            onChange(value)
          }
        }}
        {...rest}
      />
    )
  }
)

MonetaryInput.displayName = 'MonetaryInput'

export default MonetaryInput
