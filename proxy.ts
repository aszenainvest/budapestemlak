import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const MIN_SERVER_ACTION_ID_LENGTH = 10

export function proxy(request: NextRequest) {
  const actionId =
    request.headers.get('next-action') ?? request.headers.get('Next-Action')

  if (request.method === 'POST' && actionId && actionId.length < MIN_SERVER_ACTION_ID_LENGTH) {
    return new NextResponse('Bad Request', { status: 400 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
