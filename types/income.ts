export type Income = {
  id: string
  user_id: string
  account_id: string
  category_id: string
  currency_id: string
  donator_id?: string
  amount: number
  remark?: string
  status: string
  created_at: Date | string
  approved_at?: Date | string | null
  rejected_at?: Date | string | null
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
