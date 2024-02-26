export type Donator = {
  id: string
  first_name: string
  last_name: string
  display_name?: string
  address?: string
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
  address?: string
  updated_at?: Date
}
