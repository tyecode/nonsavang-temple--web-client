import { type NextRequest } from 'next/server'
import { NextResponse, NextMiddleware, NextFetchEvent } from 'next/server'

export const redirectMiddleware = (middleware: NextMiddleware) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    if (request.nextUrl.pathname === '/dashboard') {
      return NextResponse.redirect(new URL('/dashboard/users', request.url))
    }

    return middleware(request, event)
  }
}
