import { getCachedGlobal } from '@/utilities/getGlobals'
import { resolveFrontendLocale } from '@/utilities/resolveFrontendLocale'
import Link from 'next/link'
import React from 'react'
import { cookies, draftMode } from 'next/headers'
import type { Footer, Header, Setting } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import {
  Globe,
  Phone,
  Mail,
  Instagram,
  Linkedin,
  Facebook,
  Youtube,
  ExternalLink,
} from 'lucide-react'

const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    width="20"
    height="20"
    fill="#a1a1a1"
  >
    <path d="M296.591 223.331L455.427 42.667h-37.639L279.871 199.535L169.716 42.667H42.666l166.575 237.212L42.666 469.333h37.642l145.644-165.658l116.331 165.658h127.05L296.582 223.331zm-51.555 58.638l-16.877-23.621L93.87 70.393h57.815L260.057 222.08l16.878 23.621l140.871 197.168h-57.815l-114.955-160.89z" />
  </svg>
)

const iconMap = {
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: XIcon,
  x: XIcon,
  facebook: Facebook,
  youtube: Youtube,
  other: ExternalLink,
}

export async function Footer() {
  const locale = await resolveFrontendLocale()
  const { isEnabled: draft } = await draftMode()

  const localizedFooter = (await getCachedGlobal('footer', 1)(locale)) as Footer
  const fallbackFooter = locale === 'tr' && !localizedFooter?.columns?.length
    ? (await getCachedGlobal('footer', 1)('en')) as Footer
    : undefined
  const footerData = fallbackFooter
    ? { ...fallbackFooter, ...localizedFooter, columns: fallbackFooter.columns }
    : localizedFooter
  const headerData = (await getCachedGlobal('header', 1, { overrideAccess: true, draft })(
    locale,
  )) as Header
  const settingsData = (await getCachedGlobal('settings', 1)(locale)) as Setting

  const showHeaderNav = footerData?.syncWithHeader
  const columns = showHeaderNav
    ? [{ label: footerData?.navigationColumnLabel || 'Navigation', navItems: headerData?.navItems }]
    : footerData?.columns || []

  return (
    <footer className="bg-gray-50/80 border-t border-gray-100 pt-20 pb-10">
      <div className="container px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24 mb-20">
          {/* Brand Info */}
          <div className="md:col-span-4 lg:col-span-4">
            <Link href="/" className="inline-block mb-8">
              <Logo
                width={footerData?.logoWidth || 100}
                logo={settingsData?.logo}
                brandName={settingsData?.brandName}
              />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed font-light max-w-sm mb-8">
              {footerData?.description}
            </p>

            {/* Social Links for prominence */}
            <div className="flex items-center gap-5 text-gray-400">
              {footerData?.socialLinks?.map((social, i) => {
                const platformKey = social.platform?.toLowerCase() as keyof typeof iconMap
                const Icon = iconMap[platformKey] || ExternalLink
                return (
                  <a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--secondary)] transition-all hover:scale-110 active:scale-95"
                    title={social.label || social.platform}
                  >
                    <Icon size={22} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Nav & Contact Columns */}
          <div className="md:col-span-8 lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {columns.map((column, i) => (
                <div key={i} className="flex flex-col gap-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary)]">
                    {column.label}
                  </h4>
                  <nav className="flex flex-col gap-4">
                    {column.navItems?.map(({ link }, j) => (
                      <CMSLink
                        key={j}
                        {...link}
                        className="text-gray-400 hover:text-[var(--secondary)] text-sm transition-colors duration-300 font-normal"
                      />
                    ))}
                  </nav>
                </div>
              ))}

              {/* Dynamic Contact Column */}
              <div className="flex flex-col gap-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary)]">
                  {footerData?.contactColumnLabel || 'Contact'}
                </h4>
                <div className="flex flex-col gap-4">
                  {footerData?.contacts?.address && (
                    <div className="flex gap-3 text-gray-400 text-sm">
                      <Globe size={16} className="shrink-0 text-[var(--secondary)]" />
                      <p className="font-light leading-snug">{footerData.contacts.address}</p>
                    </div>
                  )}
                  {footerData?.contacts?.email && (
                    <a
                      href={`mailto:${footerData.contacts.email}`}
                      className="flex items-center gap-3 text-gray-400 hover:text-[var(--secondary)] text-sm transition-colors"
                    >
                      <Mail size={16} className="shrink-0 text-[var(--secondary)]" />
                      {footerData.contacts.email}
                    </a>
                  )}
                  {footerData?.contacts?.phone && (
                    <a
                      href={`tel:${footerData.contacts.phone}`}
                      className="flex items-center gap-3 text-gray-400 hover:text-[var(--secondary)] text-sm transition-colors"
                    >
                      <Phone size={16} className="shrink-0 text-[var(--secondary)]" />
                      {footerData.contacts.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
            {footerData?.copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}
