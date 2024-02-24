'use server'

import { createClient } from '@supabase/supabase-js'
import { UserCreationData, UserModificationData } from '@/types/user'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE!
)

export const getUser = async (id?: string) => {
  try {
    let query: any = supabase.from('user')

    if (id) {
      query = query.select('*').eq('id', id)
    } else {
      query = query.select('*')
    }

    const { data } = await query

    return {
      data,
      error: null,
      message: `User${id ? '' : 's'} retrieval was successful.`,
    }
  } catch (error) {
    return {
      data: null,
      error,
      message: `Failed to retrieve user${id ? '' : 's'}. Please try again.`,
    }
  }
}

export const createUser = async (object: UserCreationData) => {
  const { email, password, first_name, last_name } = object

  try {
    const {
      data: { user },
    } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name,
        last_name,
      },
    })

    return {
      data: user,
      error: null,
      message: `User creation was successful.`,
    }
  } catch (error) {
    return {
      data: null,
      error,
      message: `Failed to create a new user. Please try again.`,
    }
  }
}

export const updateUser = async (id: string, object: UserModificationData) => {
  try {
    const { data } = await supabase
      .from('user')
      .update(object)
      .eq('id', id)
      .select()

    return {
      data,
      error: null,
      message: `User update was successful.`,
    }
  } catch (error) {
    return {
      data: null,
      error,
      message: 'Failed to update the selected user. Please try again.',
    }
  }
}

export const deleteUser = async (id: string) => {
  try {
    const { data } = await supabase.auth.admin.deleteUser(id)

    return {
      data,
      error: null,
      message: 'User deletion was successful.',
    }
  } catch (error) {
    return {
      data: null,
      error,
      message: 'Failed to delete the selected user. Please try again.',
    }
  }
}
