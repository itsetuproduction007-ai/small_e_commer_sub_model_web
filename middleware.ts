import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // If accessing /admin, check for auth token
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Exclude the login page itself from the redirect loop
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next()
    }

    const authCookie = request.cookies.get('admin_auth')
    
    if (!authCookie || authCookie.value !== 'authenticated') {
      // Not authenticated, redirect to login page
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
  
  return NextResponse.next()
}

// Only run middleware on admin routes
export const config = {
  matcher: '/admin/:path*',
}
