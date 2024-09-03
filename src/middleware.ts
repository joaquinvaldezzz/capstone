import { cookies } from 'next/headers'
import { NextResponse, type MiddlewareConfig, type NextRequest } from 'next/server'

import { decrypt } from '@/lib/session'

/**
 * Middleware function that handles route protection and session management.
 *
 * @param request - The NextRequest object representing the incoming request.
 * @returns A NextResponse object representing the response to be sent.
 */
export default async function middleware(request: NextRequest) {
  // 1. Specify protected and public routes
  const protectedRoutes = ['/dashboard']
  const publicRoutes = ['/']

  // 2. Check if the current route is protected or public
  const currentPath = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(currentPath)
  const isPublicRoute = publicRoutes.includes(currentPath)

  // 3. Decrypt the session from the cookie
  const cookie = cookies().get('session')?.value
  const session = await decrypt(cookie)

  // 4. Redirect if the route is protected and the user is not authenticated
  if (isProtectedRoute && session?.userId == null) {
    return NextResponse.redirect(new URL('/', request.nextUrl))
  }

  // 5. Redirect if the route is public and the user is authenticated
  if (
    isPublicRoute &&
    session?.userId != null &&
    !request.nextUrl.pathname.startsWith('/dashboard')
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl))
  }

  return NextResponse.next()
}

export const config: MiddlewareConfig = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
