'use server'

import { DonatorCreationData, DonatorModificationData } from '@/types/donator'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

export const createDonator = async (object: DonatorCreationData) => {
  try {
    const { data } = await supabase.from('donator').insert(object).select()

    return {
      data,
      error: null,
      message: 'Donator was created successfully.',
    }
  } catch (error) {
    return {
      data: null,
      error,
      message: 'Failed to create donator. Please try again.',
    }
  }
}

export const updateDonator = async (
  id: string,
  object: DonatorModificationData
) => {
  try {
    const { data } = await supabase
      .from('donator')
      .update(object)
      .eq('id', id)
      .select()

    return {
      data,
      error: null,
      message: 'Donator was updated successfully.',
    }
  } catch (error) {
    return {
      data: null,
      error,
      message: 'Failed to update donator. Please try again.',
    }
  }
}

export const deleteDonator = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('donator')
      .delete()
      .eq('id', id)
      .select()

    if (error) {
      return {
        data: null,
        error,
        message: error.message || 'Failed to delete donator. Please try again.',
      }
    }

    return {
      data,
      error: null,
      message: 'Donator was deleted successfully.',
    }
  } catch (error) {
    return {
      data: null,
      error,
      message: 'Failed to delete donator. Please try again.',
    }
  }
}
