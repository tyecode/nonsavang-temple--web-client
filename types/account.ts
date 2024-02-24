export type Account = {
  id: string
  user_id: string
  name: string
  balance: number
  currency_id: string
  created_at: Date
  updated_at?: Date
  remark?: string
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
  updated_at?: Date
  remark?: string
}
