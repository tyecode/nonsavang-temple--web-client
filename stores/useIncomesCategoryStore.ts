import { IncomesCategory } from '@prisma/client'
import { create } from 'zustand'

interface CategoryState {
  category: {
    id: string
    name: string
    remark?: string | null
  }[]
  updateCategory: (state: CategoryState['category']) => void
}

export const useIncomesCategoryStore = create<CategoryState>((set) => ({
  category: [],
  updateCategory: (state) => set(() => ({ category: state })),
}))
