import { create } from 'zustand'
import { User } from '@/types/user'

interface SelectedStore {
  users: string[]
  updateUsers: (users: string[]) => void
}

export const useSelectedStore = create<SelectedStore>((set) => ({
  users: [],
  updateUsers: (users) =>
    set((state) => ({
      users: [...users],
    })),
}))
