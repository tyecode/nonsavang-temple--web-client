'use server'

import {
  CategoryCreationData,
  CategoryModificationData,
} from '@/types/category'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

export const getExpenseCategory = async (id?: string) => {
  try {
    let query: any = supabase.from('expense_category')

    if (id) {
      query = query.select('*').eq('id', id)
    } else {
      query = query.select('*')
    }

    const { data } = await query

    return {
      data,
      error: null,
      message: `Expense category${id ? '' : 's'} retrieval was successful.`,
    }
  } catch (error) {
    return {
      data: null,
      error,
      message: `Failed to retrieve expense category${id ? '' : 's'}. Please try again.`,
    }
  }
}

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
