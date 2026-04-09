import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'
import { cookies } from 'next/headers'
import type { Footer, Setting } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { Globe, Phone, Mail } from 'lucide-react'

export async function Footer() {
  const cookieStore = await cookies()
  const locale = cookieStore.get('payload-locale')?.value || 'tr'
  
  const footerData: Footer = await getCachedGlobal('footer', 1)(locale)
  const settingsData: Setting = await getCachedGlobal('settings', 1)(locale)

  const columns = footerData?.columns || []

  return (
    <footer className="bg-gray-50/80 border-t border-gray-100 pt-20 pb-10">
      <div className="container px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24 mb-20">
          
          {/* Brand Info */}
          <div className="md:col-span-4 lg:col-span-4">
            <Link href="/" className="inline-block mb-8">
              <Logo logo={settingsData?.logo} brandName={settingsData?.brandName} />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed font-light max-w-sm">
              30 yıllık tecrübe ile yatırım dünyasında güvenilir bir liman, sürdürülebilir büyümenin adresi.
            </p>
          </div>

          {/* Nav Columns */}
          <div className="md:col-span-8 lg:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
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
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
            {footerData?.copyright}
          </p>

          <div className="flex items-center gap-6 text-gray-400">
             <Globe size={18} className="hover:text-[var(--secondary)] cursor-pointer transition-colors" />
             <Mail size={18} className="hover:text-[var(--secondary)] cursor-pointer transition-colors" />
             <Phone size={18} className="hover:text-[var(--secondary)] cursor-pointer transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  )
}
