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

  const response = NextResponse.redirect(destination)
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
