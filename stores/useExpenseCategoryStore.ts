import { Category } from '@/types/category'
import { create } from 'zustand'

export interface CategoryState {
  categories: Category[]
  setCategories: (state: Category[]) => void
}

export const useExpenseCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  setCategories: (state) => set(() => ({ categories: state })),
}))
