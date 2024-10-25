/* eslint-disable @typescript-eslint/await-thenable */
import { cookies } from 'next/headers'
import { NextResponse, type MiddlewareConfig, type NextRequest } from 'next/server'

import { decrypt, type SessionPayload } from '@/lib/session'

/**
 * Middleware function that handles route protection and session management.
 *
 * @param request - The NextRequest object representing the incoming request.
 * @returns A NextResponse object representing the response to be sent.
 */
export default async function middleware(request: NextRequest) {
  // Specify protected and public routes
  const protectedRoutes = ['/admin', '/doctor', '/patient']
  const publicRoutes = ['/']

  // Get the current path from the request
  const currentPath = request.nextUrl.pathname

  // Check if the current route is protected or public
  const isProtectedRoute = protectedRoutes.includes(currentPath)
  const isPublicRoute = publicRoutes.includes(currentPath)

  // Decrypt the session from the cookie
  const cookieStore = await cookies()
  const cookie = cookieStore.get('session')?.value
  const session = (await decrypt(cookie)) as SessionPayload

  /** Redirect to the login page if the route is protected and the user is not authenticated. */
  if (isProtectedRoute && session?.userId == null) {
    return NextResponse.redirect(new URL('/', request.nextUrl))
  }

  /**
   * Redirect to their dashboard if they are trying to access a different dashboard while they are
   * already authenticated as a different user role.
   */
  if (isProtectedRoute && session?.userRole === 'admin' && !currentPath.includes('/admin')) {
    return NextResponse.redirect(new URL('/admin/users', request.nextUrl))
  } else if (
    isProtectedRoute &&
    session?.userRole === 'doctor' &&
    !currentPath.includes('/doctor')
  ) {
    return NextResponse.redirect(new URL('/doctor/results', request.nextUrl))
  } else if (
    isProtectedRoute &&
    session?.userRole === 'patient' &&
    !currentPath.includes('/patient')
  ) {
    return NextResponse.redirect(new URL('/patient', request.nextUrl))
  }

  /**
   * Redirect to the their dashboard if they are trying to access the login page while they are
   * already authenticated.
   */
  if (isPublicRoute && session?.userId != null) {
    if (session?.userRole === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.nextUrl))
    } else if (session?.userRole === 'doctor') {
      return NextResponse.redirect(new URL('/doctor', request.nextUrl))
    } else if (session?.userRole === 'patient') {
      return NextResponse.redirect(new URL('/patient', request.nextUrl))
    }
  }

  // Otherwise, continue to the next middleware
  return NextResponse.next()
}

export const config: MiddlewareConfig = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     *
     * - Api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
