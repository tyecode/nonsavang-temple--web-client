export type User = {
  id: string
  email: string
  role: string
  title: string
  first_name: string
  last_name: string
  display_name?: string
  image?: string
  created_at: Date | string
  updated_at?: Date | string | null
}

export type UserCreationData = {
  email: string
  title: string
  first_name: string
  last_name: string
  password: string
}

export type UserModificationData = {
  role?: string
  title?: string
  first_name?: string
  last_name?: string
  image?: string | null
  updated_at?: Date | string | null
}
