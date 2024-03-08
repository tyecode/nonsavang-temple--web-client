export type Currency = {
  id: string
  code: string
  name: string
  created_at: Date
  updated_at?: Date
}

export type CurrencyCreationData = {
  code: string
  name: string
}

export type CurrencyModificationData = {
  code?: string
  name?: string
  updated_at?: Date
}
