import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest): Promise<NextResponse<unknown>> {
  const SECRET = new TextEncoder().encode(`${process.env.JWT_SECRET ?? 'secret'}`)
  const JWT_TOKEN = request.cookies.get('TOKEN')?.value
  const url = request.nextUrl.pathname

  // Admin dashboard
  if (url.includes('/dashboard/admin')) {
    if (JWT_TOKEN === undefined) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    try {
      const { payload } = await jwtVerify(JWT_TOKEN, SECRET)

      if (payload.role === 'admin') {
        return NextResponse.redirect(new URL('/dashboard/admin', request.url))
      }

      return NextResponse.next()
    } catch (error) {
      return NextResponse.next()
    }
  }

  // Doctor dashboard
  if (url.includes('/dashboard/doctor')) {
    if (JWT_TOKEN === undefined) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    try {
      const { payload } = await jwtVerify(JWT_TOKEN, SECRET)

      if (payload.role === 'doctor') {
        return NextResponse.redirect(new URL('/dashboard/doctor', request.url))
      }

      return NextResponse.next()
    } catch (error) {
      return NextResponse.next()
    }
  }

  // Patient dashboard
  if (url.includes('/dashboard/patient')) {
    if (JWT_TOKEN === undefined) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    try {
      const { payload } = await jwtVerify(JWT_TOKEN, SECRET)

      if (payload.role === 'patient') {
        return NextResponse.redirect(new URL('/dashboard/patient', request.url))
      }

      return NextResponse.next()
    } catch (error) {
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
