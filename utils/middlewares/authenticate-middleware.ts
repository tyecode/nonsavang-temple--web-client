import { type NextRequest } from 'next/server'
import { NextResponse, NextMiddleware, NextFetchEvent } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export const authenticateMiddleware = (middleware: NextMiddleware) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const response = NextResponse.next()
    const supabase = createMiddlewareClient({ req: request, res: response })

    const { data } = await supabase.auth.getUser()

    if (!data && !request.nextUrl.pathname.startsWith('/login')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    return middleware(request, event)
  }
}
