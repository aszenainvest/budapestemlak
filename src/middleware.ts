import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Blocks fake / malformed Server-Action requests that come from bots,
 * crawlers, or security-scanners. Valid Next.js action IDs are 40-char
 * hex strings; anything shorter (like the literal "x") is bogus.
 */
export function middleware(request: NextRequest) {
  const actionId = request.headers.get('Next-Action')

  // Only inspect POST requests that carry the Next-Action header
  if (request.method === 'POST' && actionId) {
    // Valid Next.js server-action IDs are 40-character hex strings
    const isValid = /^[0-9a-f]{40}$/i.test(actionId)

    if (!isValid) {
      return new NextResponse('Bad Request', { status: 400 })
    }
  }

  return NextResponse.next()
}

// Run on all routes except static files and images
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
