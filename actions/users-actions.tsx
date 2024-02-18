'use server'

import { createClient } from '@supabase/supabase-js'
import { UserCreationData, UserModificationData } from '@/types/user'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE!
)

export const getUsers = async () => {
  try {
    const { data: users } = await supabase.from('users').select('*')

    return {
      data: users,
      error: null,
      message: `Users retrieval was successful.`,
    }
  } catch (error) {
    return {
      data: null,
      error,
      message: `Failed to retrieve users. Please try again.`,
    }
  }
}

export const createUser = async (object: UserCreationData) => {
  const { email, password, firstname, lastname } = object

  try {
    const {
      data: { user },
    } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (user) {
      await updateUser(user.id, { firstname, lastname })
    }

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

export const updateUser = async (
  where: string,
  object: UserModificationData
) => {
  try {
    const { data } = await supabase
      .from('users')
      .update(object)
      .eq('id', where)
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

export const deleteUser = async (where: string) => {
  try {
    const { data } = await supabase.auth.admin.deleteUser(where)

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
