export type User = {
  id: string
  email: string
  role: string
  firstname: string
  lastname: string
  displayName?: string
  image?: string
  created_at: Date
  updated_at?: Date
}

export type UserCreationData = Pick<
  User,
  'email' | 'firstname' | 'lastname'
> & {
  password: string
}

export type UserModificationData = Partial<
  Omit<User, 'id' | 'email' | 'displayName' | 'created_at'>
>
