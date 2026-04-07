import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const locale = searchParams.get('locale')
  const path = searchParams.get('path') || '/'
  
  if (locale) {
    const cookieStore = await cookies()
    cookieStore.set('payload-locale', locale, {
      path: '/',
      maxAge: 31536000,
      sameSite: 'lax',
    })
  }

  // Use a hard redirect to bypass Next.js client-side fetch mechanism
  redirect(path)
}
