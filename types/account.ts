import { User } from './user'
import { Currency } from './currency'

export type Account = {
  id: string
  user: User
  balance: number
  currency: Currency
  created_at: Date | string
  updated_at?: Date | string
  remark?: string
}

export type AccountCreationData = {
  user_id: string
  balance: number
  currency_id: string
  remark?: string
}

export type AccountModificationData = {
  balance?: number
  updated_at?: Date
  remark?: string
}
