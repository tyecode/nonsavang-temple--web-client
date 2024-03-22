import { Category } from '@/types/category'
import { create } from 'zustand'

export interface CategoryState {
  categories: Category[]
  setCategories: (state: Category[]) => void
}

export const useIncomeCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  setCategories: (state) =>
    set(() => ({
      categories: state.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    })),
}))
