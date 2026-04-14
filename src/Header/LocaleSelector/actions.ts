'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function setLocaleAction(formData: FormData) {
  const currentPath = (formData.get('path') as string) || '/'

  const cookieStore = await cookies()
  cookieStore.set('payload-locale', 'en', {
    path: '/',
    maxAge: 31536000,
    sameSite: 'lax',
  })

  revalidatePath(currentPath)
  redirect(currentPath)
}
