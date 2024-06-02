'use server'

import {
  CurrencyCreationData,
  CurrencyModificationData,
} from '@/types/currency'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

export const createCurrency = async (object: CurrencyCreationData) => {
  try {
    const { data } = await supabase.from('currency').insert(object).select()

    return {
      data,
      error: null,
      message: 'Currency was created successfully.',
    }
  } catch (error) {
    return {
      data: null,
      error,
      message: 'Failed to create currency. Please try again.',
    }
  }
}

export const updateCurrency = async (
  id: string,
  object: CurrencyModificationData
) => {
  try {
    const { data } = await supabase
      .from('currency')
      .update(object)
      .eq('id', id)
      .select()

    return {
      data,
      error: null,
      message: 'Currency was updated successfully.',
    }
  } catch (error) {
    return {
      data: null,
      error,
      message: 'Failed to update currency. Please try again.',
    }
  }
}

export const deleteCurrency = async (id: string) => {
  try {
    const { data } = await supabase
      .from('currency')
      .delete()
      .eq('id', id)
      .select()

    return {
      data,
      error: null,
      message: 'Currency was deleted successfully.',
    }
  } catch (error) {
    return {
      data: null,
      error,
      message: 'Failed to delete currency. Please try again.',
    }
  }
}
