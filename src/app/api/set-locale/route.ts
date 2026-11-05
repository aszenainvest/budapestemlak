import { NextRequest, NextResponse } from 'next/server'

export function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const locale = searchParams.get('locale')
  const path = searchParams.get('path') || '/'
  const destination = new URL('/', origin)
  if (path.startsWith('/') && !path.startsWith('//') && !path.includes('\\')) {
    const candidate = new URL(path, origin)
    if (candidate.origin === origin) {
      destination.pathname = candidate.pathname
      destination.search = candidate.search
    }
  }

  // Keep the redirect relative because the deployment proxy can expose an internal origin.
  const response = new NextResponse(null, {
    status: 307,
    headers: { Location: destination.pathname + destination.search },
  })
  if (locale === 'en' || locale === 'tr') {
    response.cookies.set('site-language', locale, {
      path: '/',
      maxAge: 31536000,
      sameSite: 'lax',
      httpOnly: true,
    })
  }
  return response
}
