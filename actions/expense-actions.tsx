'use server'

import { ExpenseCreationData, ExpenseModificationData } from '@/types/expense'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

export const createExpense = async (object: ExpenseCreationData) => {
  try {
    const { data } = await supabase
      .from('expense')
      .insert(object)
      .select(
        `*, 
        category: category_id (*), 
        currency: currency_id (*), 
        user: user_id (*), 
        account: account_id (*, currency: currency_id (*)), 
        drawer: drawer_id (*)`
      )

    return {
      data,
      error: null,
      message: 'Expense was created successfully.',
    }
  } catch (error) {
    return {
      data: null,
      error,
      message: 'Failed to create expense. Please try again.',
    }
  }
}

export const updateExpense = async (
  id: string,
  object: ExpenseModificationData
) => {
  try {
    const { data } = await supabase
      .from('expense')
      .update(object)
      .eq('id', id)
      .select(
        `*, 
        category: category_id (*), 
        currency: currency_id (*), 
        user: user_id (*), 
        account: account_id (*, currency: currency_id (*)), 
        drawer: drawer_id (*)`
      )

    return {
      data,
      error: null,
      message: 'Expense was updated successfully.',
    }
  } catch (error) {
    return {
      data: null,
      error,
      message: 'Failed to update expense. Please try again.',
    }
  }
}

export const deleteExpense = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('expense')
      .delete()
      .eq('id', id)
      .select()

    if (error) {
      return {
        data: null,
        error,
        message: error.message || 'Failed to delete expense. Please try again.',
      }
    }

    return {
      data,
      error: null,
      message: 'Expense was deleted successfully.',
    }
  } catch (error) {
    return {
      data: null,
      error,
      message: 'Failed to delete expense. Please try again.',
    }
  }
}
