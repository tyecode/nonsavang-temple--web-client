'use server'

import { IncomeCreationData, IncomeModificationData } from '@/types/income'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE!
)

export const getIncome = async (id?: string) => {
  try {
    let query: any = supabase.from('income')

    if (id) {
      query = query
        .select(
          `*, 
          category: category_id (*), 
          user: user_id (*), 
          account: account_id (*, currency: currency_id (*)), 
          donator: donator_id (*)`
        )
        .eq('id', id)
    } else {
      query = query.select(
        `*, 
        category: category_id (*), 
        user: user_id (*), 
        account: account_id (*, currency: currency_id (*)), 
        donator: donator_id (*)`
      )
    }

    const { data } = await query

    return {
      data,
      error: null,
      message: `Income${id ? '' : 's'} retrieval was successful.`,
    }
  } catch (error) {
    return {
      data: null,
      error,
      message: `Failed to retrieve income${id ? '' : 's'}. Please try again.`,
    }
  }
}

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
    const { data } = await supabase
      .from('income')
      .delete()
      .eq('id', id)
      .select('*')

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
