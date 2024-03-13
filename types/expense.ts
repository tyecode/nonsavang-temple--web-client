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
  image?: string
  amount: number
  remark?: string
  status: string
  created_at: Date | string
  approved_at?: Date | string
  rejected_at?: Date | string | null
}

export type ExpenseCreationData = {
  user_id: string
  account_id: string
  category_id: string
  currency_id: string
  image?: string
  amount: number
  remark?: string
}

export type ExpenseModificationData = {
  status?: string
  approved_at?: Date | string | null
  rejected_at?: Date | string | null
}
