'use server'

import {
  CurrencyCreationData,
  CurrencyModificationData,
} from '@/types/currency'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE!
)

export const getCurrency = async (id?: string) => {
  try {
    let query: any = supabase.from('currency')

    if (id) {
      query = query.select('*').eq('id', id)
    } else {
      query = query.select('*')
    }

    const { data } = await query

    return {
      data,
      error: null,
      message: `Currency${id ? '' : 's'} retrieval was successful.`,
    }
  } catch (error) {
    return {
      data: null,
      error,
      message: `Failed to retrieve currency${id ? '' : 's'}. Please try again.`,
    }
  }
}

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
