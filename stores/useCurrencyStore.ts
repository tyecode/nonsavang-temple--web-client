import { create } from 'zustand'

interface CurrencyState {
  currency: string
  updateCurrency: (currency: string) => void
}

export const useCurrencyStore = create<CurrencyState>((set) => ({
  currency: 'lak',
  updateCurrency: (currency) => set(() => ({ currency: currency })),
}))
