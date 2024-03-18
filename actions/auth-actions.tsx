'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getUser } from './user-actions'

export const handleLogin = async (formData: FormData) => {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect('/login?error=Could not authenticate user')
  }

  const userResponse = await getUser(data?.user?.id)

  if (userResponse.error) {
    return redirect('/login?error=Could not retrieve user data')
  }

  const role = userResponse.data[0]?.role

  return redirect(
    role === 'ADMIN' || role === 'HOLDER' ? '/dashboard/users' : '/'
  )
}

export const handleLogout = async () => {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  await supabase.auth.signOut()

  return redirect('/login')
}

export const getSession = async () => {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  try {
    const { data } = await supabase.auth.getSession()

    return data.session
  } catch (error) {
    throw new Error('Could not retrieve Auth user')
  }
}
