import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const path = searchParams.get('path') || '/'
  const cookieStore = await cookies()
  // English-only site; ignore ?locale= to avoid stale tr/ar cookies.
  cookieStore.set('payload-locale', 'en', {
    path: '/',
    maxAge: 31536000,
    sameSite: 'lax',
  })

  // Use a hard redirect to bypass Next.js client-side fetch mechanism
  redirect(path)
}
