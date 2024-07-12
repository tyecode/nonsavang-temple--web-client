'use server'

import { IncomeCreationData, IncomeModificationData } from '@/types/income'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

export const createIncome = async (object: IncomeCreationData) => {
  try {
    const { data, error } = await supabase
      .from('income')
      .insert(object)
      .select(
        `*, 
        category: category_id (*), 
        user: user_id (*), 
        account: account_id (*, currency: currency_id (*)), 
        currency: currency_id (*), 
        donator: donator_id (*)`
      )

    return {
      data,
      error,
      message: 'Income was created successfully.',
    }
  } catch (error) {
    return {
      data: null,
      error,
      message: 'Failed to create income. Please try again.',
    }
  }
}

export const updateIncome = async (
  id: string,
  object: IncomeModificationData
) => {
  try {
    const { data } = await supabase
      .from('income')
      .update(object)
      .eq('id', id)
      .select(
        `*, 
        category: category_id (*), 
        user: user_id (*), 
        account: account_id (*, currency: currency_id (*)), 
        currency: currency_id (*), 
        donator: donator_id (*)`
      )

    return {
      data,
      error: null,
      message: 'Income was updated successfully.',
    }
  } catch (error) {
    return {
      data: null,
      error,
      message: 'Failed to update income. Please try again.',
    }
  }
}

export const deleteIncome = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('income')
      .delete()
      .eq('id', id)
      .select('*')

    if (error) {
      return {
        data: null,
        error,
        message: error.message || 'Failed to delete income. Please try again.',
      }
    }

    return {
      data,
      error: null,
      message: 'Income was deleted successfully.',
    }
  } catch (error) {
    return {
      data: null,
      error,
      message: 'Failed to delete income. Please try again.',
    }
  }
}
