import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { cookies, draftMode } from 'next/headers'
import './globals.css'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getServerSideURL } from '@/utilities/getURL'
import type { Setting } from '@/payload-types'
import { generateCSSVariables } from '@/utilities/generateCSSVariables'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const cookieStore = await cookies()
  const locale = cookieStore.get('payload-locale')?.value || 'tr'
  const settings: Setting = await getCachedGlobal('settings', 1)(locale)

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="tr" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href={typeof settings.favicon === 'object' && settings.favicon?.url ? settings.favicon.url : '/favicon.ico'} rel="icon" sizes="32x32" />
        <style dangerouslySetInnerHTML={{ __html: generateCSSVariables(settings) }} />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
