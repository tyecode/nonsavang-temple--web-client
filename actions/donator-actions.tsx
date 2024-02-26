'use server'

import { DonatorCreationData, DonatorModificationData } from '@/types/donator'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE!
)

export const getDonator = async (id?: string) => {
  try {
    let query: any = supabase.from('donator')

    if (id) {
      query = query.select('*').eq('id', id)
    } else {
      query = query.select('*')
    }

    const { data } = await query

    return {
      data,
      error: null,
      message: `Donator${id ? '' : 's'} retrieval was successful.`,
    }
  } catch (error) {
    return {
      data: null,
      error,
      message: `Failed to retrieve donator${id ? '' : 's'}. Please try again.`,
    }
  }
}

export const createDonator = async (donator: DonatorCreationData) => {
  try {
    const { data } = await supabase.from('donator').insert(donator).select()

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
    const { data } = await supabase.from('donator').delete().eq('id', id)

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
