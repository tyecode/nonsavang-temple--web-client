import { Expense } from '@/types/expense'
import { create } from 'zustand'

export interface ExpenseState {
  expenses: Expense[]
  setExpenses: (state: Expense[]) => void
}

export const useExpenseStore = create<ExpenseState>((set) => ({
  expenses: [],
  setExpenses: (state) =>
    set(() => ({
      expenses: state
        .map((expense) => ({
          ...expense,
          drawer: expense.drawer && {
            ...expense.drawer,
            display_name: `${expense.drawer.title} ${expense.drawer.first_name} ${expense.drawer.last_name}`,
          },
          status_dates: expense.approved_at || expense.rejected_at,
        }))
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ),
    })),
}))
