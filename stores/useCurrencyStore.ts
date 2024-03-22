import { create } from 'zustand'
import { Currency } from '@/types/currency'

export interface CurrencyState {
  currencies: Currency[]
  setCurrencies: (currencies: Currency[]) => void
}

export const useCurrencyStore = create<CurrencyState>((set) => ({
  currencies: [],
  setCurrencies: (state) =>
    set(() => ({
      currencies: state.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    })),
}))
