import { Expense } from '@/types/expense'
import { create } from 'zustand'

interface ExpenseState {
  expenses: Expense[]
  setExpenses: (state: Expense[]) => void
}

export const useExpenseStore = create<ExpenseState>((set) => ({
  expenses: [],
  setExpenses: (state) => set(() => ({ expenses: state })),
}))
