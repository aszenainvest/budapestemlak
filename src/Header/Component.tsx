import { HeaderClient } from './Component.client'
import { getCachedGlobal, getGlobal } from '@/utilities/getGlobals'
import { draftMode } from 'next/headers'

export async function Header() {
  const { isEnabled: draft } = await draftMode()

  const [headerData, settingsData] = await Promise.all([
    getGlobal('header', 1, 'en', { overrideAccess: true, draft }),
    getCachedGlobal('settings', 1, { overrideAccess: true, draft })('en'),
  ])

  return <HeaderClient data={headerData} settings={settingsData} />
}
