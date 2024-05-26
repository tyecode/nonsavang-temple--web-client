'use server'

import { UserCreationData, UserModificationData } from '@/types/user'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

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
  try {
    const {
      data: { user },
    } = await supabase.auth.admin.createUser({
      ...object,
      email_confirm: true,
      user_metadata: {
        title: object.title,
        first_name: object.first_name,
        last_name: object.last_name,
      },
    })

    return {
      data: [
        {
          id: user?.id,
          title: user?.user_metadata.title,
          first_name: user?.user_metadata.first_name,
          last_name: user?.user_metadata.last_name,
          email: user?.email,
          role: 'USER',
          created_at: user?.created_at,
          updated_at: undefined,
        },
      ],
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
