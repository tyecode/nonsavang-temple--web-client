import { type NextRequest } from 'next/server'
import { NextResponse, NextMiddleware, NextFetchEvent } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export const authenticateMiddleware = (middleware: NextMiddleware) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const response = NextResponse.next()
    const supabase = createMiddlewareClient({ req: request, res: response })
    const hasCookie = request.cookies.get(
      process.env.NEXT_PUBLIC_SUPABASE_AUTH_COOKIE_NAME!
    )?.value

    if (!hasCookie && request.cookies.get('nonsavang-user-data')?.value) {
      response.cookies.delete('nonsavang-user-data')
      return response
    }

    if (!hasCookie && !request.nextUrl.pathname.startsWith('/login')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user && !request.nextUrl.pathname.startsWith('/login')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    return middleware(request, event)
  }
}
