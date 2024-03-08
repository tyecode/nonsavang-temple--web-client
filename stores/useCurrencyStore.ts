import { create } from 'zustand'
import { Currency } from '@/types/currency'

interface CurrencyState {
  currencies: Currency[]
  setCurrencies: (currency: Currency[]) => void
}

export const useCurrencyStore = create<CurrencyState>((set) => ({
  currencies: [],
  setCurrencies: (currency) => set(() => ({ currencies: currency })),
}))
