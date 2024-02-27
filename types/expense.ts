export type Expense = {
  id: string
  user_id: string
  account_id: string
  category_id: string
  currency_id: string
  image?: string
  amount: number
  remark?: string
  status: string
  created_at: Date
  approved_at?: Date
  rejected_at?: Date
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
  approved_at?: Date
  rejected_at?: Date
}
