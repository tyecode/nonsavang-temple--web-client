import { type NextRequest } from 'next/server'
import { NextFetchEvent, NextMiddleware, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { createClient } from '@/utils/supabase/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export const authorizeMiddleware = (middleware: NextMiddleware) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const response = NextResponse.next()
    const cookieStore = cookies()

    const supabase = createMiddlewareClient({ req: request, res: response })
    const client = createClient(cookieStore)

    const auth = await supabase.auth.getSession()
    const { data } = await client
      .from('user')
      .select('*')
      .eq('id', auth.data.session?.user.id)

    if (data && request.nextUrl.pathname.startsWith('/dashboard')) {
      if (data[0]?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

    return middleware(request, event)
  }
}
