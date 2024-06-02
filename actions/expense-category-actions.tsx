'use server'

import {
  CategoryCreationData,
  CategoryModificationData,
} from '@/types/category'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

export const createExpenseCategory = async (object: CategoryCreationData) => {
  try {
    const { data } = await supabase
      .from('expense_category')
      .insert(object)
      .select()

    return {
      data,
      error: null,
      message: 'Expense category was created successfully.',
    }
  } catch (error) {
    return {
      data: null,
      error,
      message: 'Failed to create expense category. Please try again.',
    }
  }
}

export const updateExpenseCategory = async (
  id: string,
  object: CategoryModificationData
) => {
  try {
    const { data } = await supabase
      .from('expense_category')
      .update(object)
      .eq('id', id)
      .select()

    return {
      data,
      error: null,
      message: 'Expense category was updated successfully.',
    }
  } catch (error) {
    return {
      data: null,
      error,
      message: 'Failed to update expense category. Please try again.',
    }
  }
}

export const deleteExpenseCategory = async (id: string) => {
  try {
    const { data } = await supabase
      .from('expense_category')
      .delete()
      .eq('id', id)
      .select()

    return {
      data,
      error: null,
      message: 'Expense category was deleted successfully.',
    }
  } catch (error) {
    return {
      data: null,
      error,
      message: 'Failed to delete expense category. Please try again.',
    }
  }
}
