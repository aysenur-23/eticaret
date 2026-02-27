import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/auth') {
      return NextResponse.next()
    }

    const sessionCookie = request.cookies.get('admin_session')?.value
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/admin/auth', request.url))
    }

    try {
      const secret = new TextEncoder().encode(JWT_SECRET)
      const { payload } = await jose.jwtVerify(sessionCookie, secret)
      if (payload.admin === true && payload.sub) {
        return NextResponse.next()
      }
    } catch {
      // JWT geçersiz veya süresi dolmuş
    }
    return NextResponse.redirect(new URL('/admin/auth', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
