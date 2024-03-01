import { Currency } from './currency'
import { User } from './user'

export type Account = {
  id: string
  user: Omit<User, 'created_at' | 'updated_at'>
  balance: number
  currency: Omit<Currency, 'created_at' | 'updated_at'>
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
