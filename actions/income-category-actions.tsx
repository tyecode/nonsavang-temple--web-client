'use server'

import {
  CategoryCreationData,
  CategoryModificationData,
} from '@/types/category'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

export const createIncomeCategory = async (object: CategoryCreationData) => {
  try {
    const { data } = await supabase
      .from('income_category')
      .insert(object)
      .select()

    return {
      data,
      error: null,
      message: 'Income category was created successfully.',
    }
  } catch (error) {
    return {
      data: null,
      error,
      message: 'Failed to create income category. Please try again.',
    }
  }
}

export const updateIncomeCategory = async (
  id: string,
  object: CategoryModificationData
) => {
  try {
    const { data } = await supabase
      .from('income_category')
      .update(object)
      .eq('id', id)
      .select()

    return {
      data,
      error: null,
      message: 'Income category was updated successfully.',
    }
  } catch (error) {
    return {
      data: null,
      error,
      message: 'Failed to update income category. Please try again.',
    }
  }
}

export const deleteIncomeCategory = async (id: string) => {
  try {
    const { data } = await supabase
      .from('income_category')
      .delete()
      .eq('id', id)
      .select()

    return {
      data,
      error: null,
      message: 'Income category was deleted successfully.',
    }
  } catch (error) {
    return {
      data: null,
      error,
      message: 'Failed to delete income category. Please try again.',
    }
  }
}
