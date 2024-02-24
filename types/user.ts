export type User = {
  id: string
  email: string
  role: string
  first_name: string
  last_name: string
  display_name?: string
  image?: string
  created_at: Date
  updated_at?: Date
}

export type UserCreationData = {
  email: string
  first_name: string
  last_name: string
  password: string
}

export type UserModificationData = {
  role?: string
  first_name?: string
  last_name?: string
  image?: string
  updated_at?: Date
}
