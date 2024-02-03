import { create } from 'zustand'

interface PendingStore {
  isPending: boolean
  setPending: (state: boolean) => void
}

export const usePendingStore = create<PendingStore>((set) => ({
  isPending: false,
  setPending: (state) => set(() => ({ isPending: state })),
}))
