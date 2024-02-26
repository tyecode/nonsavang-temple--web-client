import { create } from 'zustand'
import { Donator } from '@/types/donator'

interface DonatorState {
  donators: Donator[]
  updateDonators: (donators: Donator[]) => void
}

export const useDonatorStore = create<DonatorState>((set) => ({
  donators: [],
  updateDonators: (donator) =>
    set((state) => ({
      donators: donator.map((donator, index) => ({
        ...donator,
        display_name: `${donator.first_name} ${donator.last_name}`,
      })),
    })),
}))
