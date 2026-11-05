import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const MIN_SERVER_ACTION_ID_LENGTH = 10

export function proxy(request: NextRequest) {
  const actionId =
    request.headers.get('next-action') ?? request.headers.get('Next-Action')

  if (request.method === 'POST' && actionId && actionId.length < MIN_SERVER_ACTION_ID_LENGTH) {
    return new NextResponse('Bad Request', { status: 400 })
  }

  const headers = new Headers(request.headers)
  headers.delete('x-site-locale')
  if (request.nextUrl.pathname === '/tr/kurumsal') {
    headers.set('x-site-locale', 'tr')
    const destination = request.nextUrl.clone()
    destination.pathname = '/kurumsal'
    return NextResponse.rewrite(destination, { request: { headers } })
  }

  return NextResponse.next({ request: { headers } })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
