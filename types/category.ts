export type Category = {
  id: string
  name: string
  created_at: Date | string
  updated_at?: Date | string | null
}

export type CategoryCreationData = {
  name: string
}

export type CategoryModificationData = {
  name?: string
  updated_at: Date | string | null
}
