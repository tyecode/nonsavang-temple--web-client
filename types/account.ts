import { User } from './user'
import { Currency } from './currency'

export type Account = {
  id: string
  user: User
  name: string
  balance: number
  currency: Currency
  remark?: string
  created_at: Date | string
  updated_at?: Date | string | null
}

export type AccountCreationData = {
  user_id: string
  name: string
  balance: number
  currency_id: string
  remark?: string
}

export type AccountModificationData = {
  name?: string
  balance?: number
  remark?: string
  updated_at?: Date | string | null
}
