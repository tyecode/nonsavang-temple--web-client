export type Donator = {
  id: string
  title: string
  first_name: string
  last_name: string
  display_name?: string
  village?: string
  district?: string
  province?: string
  created_at: Date | string
  updated_at?: Date | string | null
}

export type DonatorCreationData = {
  title: string
  first_name: string
  last_name: string
  village?: string
  district?: string
  province?: string
}

export type DonatorModificationData = {
  title?: string
  first_name?: string
  last_name?: string
  village?: string
  district?: string
  province?: string
  updated_at: Date | string | null
}
