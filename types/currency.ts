export type Currency = {
  id: string
  code: string
  name: string
  symbol: string
  created_at: Date | string
  updated_at?: Date | string | null
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
  updated_at: Date | string | null
}
