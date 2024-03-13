'use server'

import { ExpenseCreationData, ExpenseModificationData } from '@/types/expense'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE!
)

export const getExpense = async (id?: string) => {
  try {
    let query: any = supabase.from('expense')

    if (id) {
      query = query
        .select(
          `*, 
          category: category_id (*), 
          currency: currency_id (*), 
          user: user_id (*), 
          account: account_id (*)`
        )
        .eq('id', id)
    } else {
      query = query.select(
        `*, 
        category: category_id (*), 
        user: user_id (*), 
        account: account_id (*, currency: currency_id (*))`
      )
    }

    const { data } = await query

    return {
      data,
      error: null,
      message: `Expense${id ? '' : 's'} retrieval was successful.`,
    }
  } catch (error) {
    return {
      data: null,
      error,
      message: `Failed to retrieve expense${id ? '' : 's'}. Please try again.`,
    }
  }
}

export const createExpense = async (object: ExpenseCreationData) => {
  try {
    const { data } = await supabase
      .from('expense')
      .insert(object)
      .select(
        `*, 
      category: category_id (*), 
      user: user_id (*), 
      account: account_id (*, currency: currency_id (*))`
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
      .select()

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
    const { data } = await supabase
      .from('expense')
      .delete()
      .eq('id', id)
      .select()

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
