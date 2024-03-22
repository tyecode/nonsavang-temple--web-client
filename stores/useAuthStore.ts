import { create } from 'zustand'
import { User } from '@/types/user'

export interface UserState {
  auth: User
  setAuth: (state: User) => void
}

export const useAuthStore = create<UserState>((set) => ({
  auth: {} as User,
  setAuth: (state) =>
    set(() => ({
      auth: {
        ...state,
        display_name: `${state.title} ${state.first_name} ${state.last_name}`,
      } as User,
    })),
}))
