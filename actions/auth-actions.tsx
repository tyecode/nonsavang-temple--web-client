'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export const getAuth = async () => {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  try {
    const { data } = await supabase.auth.getSession()

    return data.session
  } catch (error) {
    throw new Error('Could not retrieve Auth user')
  }
}
