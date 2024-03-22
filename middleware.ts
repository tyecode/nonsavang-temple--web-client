import { NextMiddleware } from 'next/server'

import { stackMiddleware } from '@/utils/middlewares/stack-middleware'
import { supabaseMiddleware } from '@/utils/middlewares/supabase-middleware'
import { authorizeMiddleware } from '@/utils/middlewares/authorize-middleware'
import { authenticateMiddleware } from '@/utils/middlewares/authenticate-middleware'
import { redirectMiddleware } from './utils/middlewares/redirect-middleware'

type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware

const middlewares: MiddlewareFactory[] = [
  supabaseMiddleware,
  authorizeMiddleware,
  authenticateMiddleware,
  // redirectMiddleware,
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
