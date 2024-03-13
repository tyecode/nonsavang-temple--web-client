import { create } from 'zustand'
import { Donator } from '@/types/donator'

interface DonatorState {
  donators: Donator[]
  setDonators: (state: Donator[]) => void
}

export const useDonatorStore = create<DonatorState>((set) => ({
  donators: [],
  setDonators: (state) =>
    set(() => ({
      donators: state.map((donator) => ({
        ...donator,
        display_name: `${donator.title} ${donator.first_name} ${donator.last_name}`,
      })),
    })),
}))
