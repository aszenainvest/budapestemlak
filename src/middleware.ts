import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/** Bot/scanner probes (e.g. react2shell) send short values like "x". Real IDs are long hex (40+). */
const MIN_SERVER_ACTION_ID_LENGTH = 10

/**
 * Blocks fake Server-Action POSTs (bots, scanners). Do not require exactly 40 hex chars —
 * Next.js 16 uses longer action IDs; a strict /^[0-9a-f]{40}$/ caused 400 on Payload admin.
 */
export function middleware(request: NextRequest) {
  const actionId =
    request.headers.get('next-action') ?? request.headers.get('Next-Action')

  if (request.method === 'POST' && actionId && actionId.length < MIN_SERVER_ACTION_ID_LENGTH) {
    return new NextResponse('Bad Request', { status: 400 })
  }

  return NextResponse.next()
}

// Run on all routes except static files and images
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
