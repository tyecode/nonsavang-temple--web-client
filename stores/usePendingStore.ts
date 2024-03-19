import { create } from 'zustand'

export interface PendingState {
  isPending: boolean
  setPending: (state: boolean) => void
}

export const usePendingStore = create<PendingState>((set) => ({
  isPending: false,
  setPending: (state) => set(() => ({ isPending: state })),
}))
