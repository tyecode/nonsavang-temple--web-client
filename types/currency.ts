export type Currency = {
  id: string
  code: string
  name: string
  symbol: string
  created_at: Date
  updated_at?: Date
}

export type CurrencyCreationData = {
  code: string
  name: string
  symbol: string
}

export type CurrencyModificationData = {
  code?: string
  name?: string
  symbol?: string
  updated_at?: Date
}
