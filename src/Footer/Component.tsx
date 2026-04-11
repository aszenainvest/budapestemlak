import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'
import { cookies } from 'next/headers'
import type { Footer, Header, Setting } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import {
  Globe,
  Phone,
  Mail,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  Youtube,
  ExternalLink,
} from 'lucide-react'

const iconMap = {
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  facebook: Facebook,
  youtube: Youtube,
  other: ExternalLink,
}

export async function Footer() {
  const cookieStore = await cookies()
  const locale = cookieStore.get('payload-locale')?.value || 'tr'

  const footerData = (await getCachedGlobal('footer', 3)(locale)) as Footer
  const headerData = (await getCachedGlobal('header', 3)(locale)) as Header
  const settingsData = (await getCachedGlobal('settings', 3)(locale)) as Setting

  const showHeaderNav = footerData?.syncWithHeader
  const columns = showHeaderNav
    ? [{ label: 'Navigasyon', navItems: headerData?.navItems }]
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
            <p className="text-gray-500 text-sm leading-relaxed font-light max-w-sm">
              {footerData?.description}
            </p>
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
                  İletişim
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

          <div className="flex items-center gap-6 text-gray-400">
            {footerData?.socialLinks?.map((social, i) => {
              const Icon = iconMap[social.platform as keyof typeof iconMap] || ExternalLink
              return (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--secondary)] transition-colors"
                  title={social.label || social.platform}
                >
                  <Icon size={20} />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
