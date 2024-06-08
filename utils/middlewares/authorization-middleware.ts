import { NextRequest } from 'next/server'
import { NextResponse, NextMiddleware, NextFetchEvent } from 'next/server'
import { cookies } from 'next/headers'

import { User } from '@/types'

const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN']
const HOLDER_ROLES = ['HOLDER', 'SUPER_ADMIN']
const ADMIN_PROTECTED_ROUTES = [
  '/incomes',
  '/expenses',
  '/users',
  '/donators',
  '/incomes-categories',
  '/expense-categories',
  '/accounts',
  '/currencies',
]
const HOLDER_PROTECTED_ROUTES = ['/pending', '/approved', '/rejected']

const isUserInRole = (user: User, roles: string[]) => roles.includes(user.role)
const isProtectedRoute = (request: NextRequest, routes: string[]) =>
  routes.some((path) => request.nextUrl.pathname.startsWith(path))

export const authorizationMiddleware = (middleware: NextMiddleware) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const response = NextResponse.next()
    const hasCookie = request.cookies.get('nonsavang-user-data')?.value
    const token = hasCookie ? JSON.parse(hasCookie) : null

    if (!token) {
      response.cookies.delete(
        process.env.NEXT_PUBLIC_SUPABASE_AUTH_COOKIE_NAME!
      )
      return response
    }

    if (
      isProtectedRoute(request, ADMIN_PROTECTED_ROUTES) &&
      !isUserInRole(token, ADMIN_ROLES)
    ) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (
      isProtectedRoute(request, HOLDER_PROTECTED_ROUTES) &&
      !isUserInRole(token, HOLDER_ROLES)
    ) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return middleware(request, event)
  }
}
