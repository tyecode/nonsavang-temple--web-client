'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

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

  return redirect('/')
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
    console.log('Error getting session: ', error)
  }
}
