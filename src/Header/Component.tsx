import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import { cookies } from 'next/headers'

import type { Header, Setting } from '@/payload-types'

export async function Header() {
  const cookieStore = await cookies()
  const locale = cookieStore.get('payload-locale')?.value || 'tr'

  // Fetch header and settings in parallel for speed
  const [headerData, settingsData] = await Promise.all([
    getCachedGlobal('header', 3)(locale),
    getCachedGlobal('settings', 3)(locale),
  ])

  return <HeaderClient data={headerData} settings={settingsData} />
}
