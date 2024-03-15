import { create } from 'zustand'
import { Income } from '@/types/income'

interface IncomeState {
  incomes: Income[]
  setIncomes: (state: Income[]) => void
}

export const useIncomeStore = create<IncomeState>((set) => ({
  incomes: [],
  setIncomes: (state) =>
    set(() => ({
      incomes: state.map((income) => ({
        ...income,
        donator: income.donator && {
          ...income.donator,
          display_name: `${income.donator.title} ${income.donator.first_name} ${income.donator.last_name}`,
        },
      })),
    })),
}))
