import { cookies, headers } from 'next/headers'

export async function resolveFrontendLocale(): Promise<'en' | 'tr'> {
  const [cookieStore, requestHeaders] = await Promise.all([cookies(), headers()])
  if (requestHeaders.get('x-site-locale') === 'tr') return 'tr'
  const preferred = cookieStore.get('site-language')?.value
  if (preferred === 'en' || preferred === 'tr') return preferred

  const country = requestHeaders.get('cf-ipcountry')
  if (country && country !== 'XX' && country !== 'T1') return country === 'TR' ? 'tr' : 'en'

  const languages = (requestHeaders.get('accept-language') || '')
    .split(',')
    .map((entry) => {
      const [tag, weight] = entry.trim().toLowerCase().split(';')
      return { tag, quality: weight ? Number(weight.trim().replace(/^q=/, '')) : 1 }
    })
    .filter(({ quality }) => quality > 0)
    .sort((a, b) => b.quality - a.quality)
  const language = languages.find(({ tag }) => /^(tr|en)(-|$)|-tr$/.test(tag))?.tag
  return language && (/^tr(-|$)/.test(language) || language.endsWith('-tr')) ? 'tr' : 'en'
}
