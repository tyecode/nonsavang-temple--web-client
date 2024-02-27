export type Category = {
  id: string
  name: string
  created_at: Date
  updated_at?: Date
}

export type CategoryCreationData = {
  name: string
}

export type CategoryModificationData = {
  name?: string
  updated_at?: Date
}
