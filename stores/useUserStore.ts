import { create } from 'zustand'
import { User } from '@/types/user'

interface UserState {
  users: User[]
  setUsers: (state: User[]) => void
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  setUsers: (state) =>
    set(() => ({
      users: state.map((user) => ({
        ...user,
        display_name: `${user.first_name} ${user.last_name}`,
      })),
    })),
}))
