'use server'

import { AccountCreationData, AccountModificationData } from '@/types/account'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

export const createAccount = async (object: AccountCreationData) => {
  try {
    const { data } = await supabase
      .from('account')
      .insert(object)
      .select('*, user: user_id (*), currency: currency_id (*)')

    return {
      data,
      error: null,
      message: 'Account was created successfully.',
    }
  } catch (error) {
    return {
      data: null,
      error,
      message: 'Failed to create account. Please try again.',
    }
  }
}

export const updateAccount = async (
  id: string,
  object: AccountModificationData
) => {
  try {
    const { data } = await supabase
      .from('account')
      .update(object)
      .eq('id', id)
      .select('*, user: user_id (*), currency: currency_id (*)')

    return {
      data,
      error: null,
      message: 'Account was updated successfully.',
    }
  } catch (error) {
    return {
      data: null,
      error,
      message: 'Failed to update account. Please try again.',
    }
  }
}

export const deleteAccount = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('account')
      .delete()
      .eq('id', id)
      .select('*, user: user_id (*), currency: currency_id (*)')

    if (error) {
      return {
        data: null,
        error,
        message: error.message || 'Failed to delete account. Please try again.',
      }
    }

    return {
      data,
      error: null,
      message: 'Account was deleted successfully.',
    }
  } catch (error) {
    return {
      data: null,
      error,
      message: 'Failed to delete account. Please try again.',
    }
  }
}
