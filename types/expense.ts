import { Account } from './account'
import { Category } from './category'
import { Currency } from './currency'
import { User } from './user'

export type Expense = {
  id: string
  user: User
  account: Account
  category: Category
  currency: Currency
  drawer: User
  image?: string
  amount: number
  remark?: string
  status: string
  created_at: Date | string
  approved_at?: Date | string | null
  rejected_at?: Date | string | null
  status_dates?: Date | string | null
}

export type ExpenseCreationData = {
  user_id: string
  account_id: string
  category_id: string
  currency_id: string
  drawer_id: string
  image?: string
  amount: number
  remark?: string
}

export type ExpenseModificationData = {
  status?: string
  approved_at?: Date | string | null
  rejected_at?: Date | string | null
}
