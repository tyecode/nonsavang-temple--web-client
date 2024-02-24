import { create } from 'zustand'
import { User } from '@/types/user'

interface UserState {
  users: User[]
  updateUsers: (users: User[]) => void
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  updateUsers: (users) =>
    set((state) => ({
      users: users.map((user, index) => ({
        ...user,
        display_name: `${user.first_name} ${user.last_name}`,
      })),
    })),
}))
