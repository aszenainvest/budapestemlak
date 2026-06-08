import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { cookies } from 'next/headers'
import './globals.css'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { resolveFrontendLocale } from '@/utilities/resolveFrontendLocale'
import { getServerSideURL } from '@/utilities/getURL'
import type { Setting } from '@/payload-types'
import { generateCSSVariables } from '@/utilities/generateCSSVariables'
import { SiteIntegrations } from '@/components/SiteIntegrations'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = 'en'
  const settings: Setting = await getCachedGlobal('settings', 1)(locale)

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link
          href={
            typeof settings.favicon === 'object' && settings.favicon?.url
              ? settings.favicon.url
              : '/favicon.ico'
          }
          rel="icon"
          sizes="32x32"
        />
        <style dangerouslySetInnerHTML={{ __html: generateCSSVariables(settings) }} />
      </head>
      <body>
        <Providers>
          <Header />
          <main className="flex-1 overflow-hidden pt-16 lg:pt-20">{children}</main>
          <Footer />
        </Providers>
        <SiteIntegrations
          bodyScripts={settings.bodyScripts}
          headScripts={settings.headScripts}
          whatsappEnabled={settings.whatsappEnabled}
          whatsappPhone={settings.whatsappPhone}
          botimEnabled={settings.botimEnabled}
          botimContactUrl={settings.botimContactUrl}
          botimPhone={settings.botimPhone}
          imoEnabled={settings.imoEnabled}
          imoContactUrl={settings.imoContactUrl}
          imoPhone={settings.imoPhone}
        />
      </body>
    </html>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const settings: Setting = await getCachedGlobal('settings', 1)()

  return {
    metadataBase: new URL(getServerSideURL()),
    openGraph: mergeOpenGraph({}, settings),
    twitter: {
      card: 'summary_large_image',
    },
  }
}
