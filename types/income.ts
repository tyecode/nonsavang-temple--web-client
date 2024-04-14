import { Account } from './account'
import { Category } from './category'
import { Currency } from './currency'
import { Donator } from './donator'
import { User } from './user'

export type Income = {
  id: string
  user: User
  account: Account
  category: Category
  currency: Currency
  donator: Donator | null
  amount: number
  remark?: string
  status: string
  created_at: Date | string
  approved_at?: Date | string | null
  rejected_at?: Date | string | null
  status_dates?: Date | string | null
}

export type IncomeCreationData = {
  user_id: string
  account_id: string
  category_id: string
  currency_id: string
  donator_id?: string
  amount: number
  remark?: string
}

export type IncomeModificationData = {
  status?: string
  approved_at?: Date | string | null
  rejected_at?: Date | string | null
}
