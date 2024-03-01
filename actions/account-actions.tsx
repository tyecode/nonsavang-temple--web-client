'use server'

import { AccountCreationData, AccountModificationData } from '@/types/account'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE!
)

export const getAccount = async () => {
  try {
    const { data } = await supabase.from('account').select(`
    id,
    user (id, email, first_name, last_name, role),
    currency (id, code, name, symbol),
    balance,
    remark,
    created_at,
    updated_at
    `)

    return {
      data,
      error: null,
      message: 'Account retrieval was successful.',
    }
  } catch (error) {
    return {
      data: null,
      error,
      message: 'Failed to retrieve account. Please try again.',
    }
  }
}

export const createAccount = async (object: AccountCreationData) => {
  try {
    const { data } = await supabase.from('account').insert(object).select()

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
      .select()

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
    const { data } = await supabase
      .from('account')
      .delete()
      .eq('id', id)
      .select()

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
