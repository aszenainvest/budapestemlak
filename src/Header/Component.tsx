import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { resolveFrontendLocale } from '@/utilities/resolveFrontendLocale'
import React from 'react'
import { cookies, draftMode } from 'next/headers'

import type { Header, Setting } from '@/payload-types'

export async function Header() {
  const cookieStore = await cookies()
  const locale = resolveFrontendLocale(cookieStore.get('payload-locale')?.value)
  const { isEnabled: draft } = await draftMode()

  // Fetch header and settings in parallel for speed.
  // overrideAccess + draft so relationship targets populate (slug) for drafts and restricted read access.
  const [headerData, settingsData] = await Promise.all([
    getCachedGlobal('header', 3, { overrideAccess: true, draft })(locale),
    getCachedGlobal('settings', 3, { overrideAccess: true, draft })(locale),
  ])

  return <HeaderClient data={headerData} settings={settingsData} />
}
