export type Donator = {
  id: string
  first_name: string
  last_name: string
  display_name?: string
  village?: string
  district?: string
  province?: string
  created_at: Date
  updated_at?: Date
}

export type DonatorCreationData = {
  first_name: string
  last_name: string
  address?: string
}

export type DonatorModificationData = {
  first_name?: string
  last_name?: string
  village?: string
  district?: string
  province?: string
  updated_at?: Date
}
