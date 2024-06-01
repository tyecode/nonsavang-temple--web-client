import { NextMiddleware } from 'next/server'

import { stackMiddleware } from '@/utils/middlewares/stack-middleware'
import { supabaseMiddleware } from '@/utils/middlewares/supabase-middleware'
import { authenticateMiddleware } from '@/utils/middlewares/authenticate-middleware'
import { authorizationMiddleware } from '@/utils/middlewares/authorization-middleware'

type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware

const middlewares: MiddlewareFactory[] = [
  supabaseMiddleware,
  authenticateMiddleware,
  authorizationMiddleware,
]

export default stackMiddleware(middlewares)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
