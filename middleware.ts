
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * GESTALTUNG EDGE SECURITY MIDDLEWARE
 * Enforces origin isolation and strict security headers for the Design Hub.
 */
export function middleware(request: NextRequest) {
  // Only allow requests from your authorized domain
  const allowedOrigins = [
    'https://gestaltung.com',
    'https://www.gestaltung.com',
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null
  ].filter(Boolean)

  const origin = request.headers.get('origin')
  
  if (origin && !allowedOrigins.includes(origin)) {
    return new NextResponse('Forbidden: Origin Violation Detected', { status: 403 })
  }

  // Add security headers to the response
  const response = NextResponse.next()
  
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.figma.com https://generativelanguage.googleapis.com;"
  )
  
  return response
}

export const config = {
  matcher: '/api/:path*'
}
