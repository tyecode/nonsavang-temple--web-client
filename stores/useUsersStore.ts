import { create } from 'zustand'
import { User } from '@/types/user'

interface UserState {
  users: User[]
  updateUsers: (users: User[]) => void
}

export const useUsersStore = create<UserState>((set) => ({
  users: [],
  updateUsers: (users) =>
    set((state) => ({
      users: users.map((user, index) => ({
        ...user,
        displayName: `${user.firstname} ${user.lastname}`,
      })),
    })),
}))
