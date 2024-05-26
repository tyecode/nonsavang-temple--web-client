import { NextRequest } from 'next/server'
import { NextResponse, NextMiddleware, NextFetchEvent } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { getUser } from '@/actions/user-actions'

export const authorizationMiddleware = (middleware: NextMiddleware) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const response = NextResponse.next()
    const supabase = createMiddlewareClient({ req: request, res: response })
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    const { data } = await getUser(session?.user?.id)

    if (!session || !data?.length) {
      return response
    }

    const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(data[0].role)
    const isProtectedAdminRoute = [
      '/incomes',
      '/expenses',
      '/users',
      '/donators',
      '/incomes-categories',
      '/expense-categories',
      '/accounts',
      '/currencies',
    ].some((path) => request.nextUrl.pathname.startsWith(path))

    if (isProtectedAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    const isHolder = ['HOLDER', 'SUPER_ADMIN'].includes(data[0].role)
    const isProtectedHolderRoute = ['/pending', '/approved', '/rejected'].some(
      (path) => request.nextUrl.pathname.startsWith(path)
    )

    if (isProtectedHolderRoute && !isHolder) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return middleware(request, event)
  }
}
