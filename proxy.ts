import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const LOCALE_COOKIE = 'payload-locale'

/** English-only: overwrite legacy tr/ar (or any non-en) cookies so SSR matches DB. */
export function proxy(request: NextRequest) {
  const current = request.cookies.get(LOCALE_COOKIE)?.value
  if (current === 'en') {
    return NextResponse.next()
  }

  const res = NextResponse.next()
  res.cookies.set(LOCALE_COOKIE, 'en', {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })
  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
