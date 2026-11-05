import { resolveFrontendLocale } from '@/utilities/resolveFrontendLocale'
import { HeaderClient } from './Component.client'
import { getCachedGlobal, getGlobal } from '@/utilities/getGlobals'
import { draftMode } from 'next/headers'

export async function Header() {
  const locale = await resolveFrontendLocale()
  const { isEnabled: draft } = await draftMode()

  const [headerData, settingsData] = await Promise.all([
    getGlobal('header', 1, locale, { overrideAccess: true, draft }),
    getCachedGlobal('settings', 1, { overrideAccess: true, draft })(locale),
  ])

  const navigation = locale === 'tr' && !headerData?.navItems?.length
    ? await getGlobal('header', 1, 'en', { overrideAccess: true, draft })
    : headerData

  return <HeaderClient locale={locale} data={navigation} settings={settingsData} />
}
