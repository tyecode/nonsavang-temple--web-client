'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { sst } from '@/lib/select-string'

export const handleLogin = async (formData: FormData) => {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const cookieStore = cookies()
  const supabase = createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error?.status === 0) {
    return redirect('/login?error=Server connection failed')
  }

  if (error) {
    return redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  if (!user) {
    return redirect('/login?error=Authentication failed')
  }

  const { data } = await supabase
    .from('user')
    .select(
      sst(['id', 'email', 'title', 'first_name', 'last_name', 'role', 'image'])
    )
    .eq('id', user.id)

  if (!data || data.length === 0) {
    return redirect('/login?error=User not found')
  }

  cookieStore.set('nonsavang-user-data', JSON.stringify(data[0]), {
    sameSite: 'lax',
    secure: true,
  })

  return redirect('/')
}

export const handleLogout = async () => {
  const supabase = createClient()

  await supabase.auth.signOut()

  return redirect('/login')
}

export const getSession = async () => {
  const supabase = createClient()

  try {
    const { data } = await supabase.auth.getSession()

    return data.session
  } catch (error) {
    console.log('Error getting session: ', error)
  }
}
