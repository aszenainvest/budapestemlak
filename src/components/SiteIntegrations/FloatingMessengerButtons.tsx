'use client'

import React from 'react'

import {
  resolveBotimHref,
  resolveImoHref,
  resolveWhatsAppHref,
} from '@/utilities/messengerLinks'

type Props = {
  whatsappEnabled?: boolean | null
  whatsappPhone?: string | null
  botimEnabled?: boolean | null
  botimContactUrl?: string | null
  botimPhone?: string | null
  imoEnabled?: boolean | null
  imoContactUrl?: string | null
  imoPhone?: string | null
}

function FloatingButton({
  href,
  label,
  className,
  children,
}: {
  href: string
  label: string
  className: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105 ${className}`}
      aria-label={label}
    >
      {children}
    </a>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8 fill-current" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

/** Botim brand mark (simplified). */
function BotimIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden>
      <rect width="32" height="32" rx="8" fill="#fff" fillOpacity="0.95" />
      <path
        fill="#00B67A"
        d="M8 10h4.2c3.4 0 5.8 2.1 5.8 5.3 0 3.1-2.4 5.2-5.8 5.2H11v4.5H8V10zm3 2.5v5.5h.9c1.7 0 2.7-.9 2.7-2.7 0-1.9-1-2.8-2.7-2.8H11zM20.5 10H24l-2.2 8.5L24 25h-3.3l-1.4-5.8L18 25h-3.3l3.7-15z"
      />
    </svg>
  )
}

/** IMO brand mark (simplified). */
function ImoIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden>
      <circle cx="16" cy="16" r="16" fill="#fff" fillOpacity="0.95" />
      <text
        x="16"
        y="20"
        textAnchor="middle"
        fill="#0099FF"
        fontSize="11"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        imo
      </text>
    </svg>
  )
}

export function FloatingMessengerButtons({
  whatsappEnabled,
  whatsappPhone,
  botimEnabled,
  botimContactUrl,
  botimPhone,
  imoEnabled,
  imoContactUrl,
  imoPhone,
}: Props) {
  const buttons: React.ReactNode[] = []

  const waHref = whatsappEnabled ? resolveWhatsAppHref(whatsappPhone) : null
  if (waHref) {
    buttons.push(
      <FloatingButton
        key="whatsapp"
        href={waHref}
        label="Chat on WhatsApp"
        className="bg-[#25D366]"
      >
        <WhatsAppIcon />
      </FloatingButton>,
    )
  }

  const botimHref = botimEnabled ? resolveBotimHref(botimContactUrl, botimPhone) : null
  if (botimHref) {
    buttons.push(
      <FloatingButton key="botim" href={botimHref} label="Chat on Botim" className="bg-[#00B67A]">
        <BotimIcon />
      </FloatingButton>,
    )
  }

  const imoHref = imoEnabled ? resolveImoHref(imoContactUrl, imoPhone) : null
  if (imoHref) {
    buttons.push(
      <FloatingButton key="imo" href={imoHref} label="Chat on IMO" className="bg-[#0099FF]">
        <ImoIcon />
      </FloatingButton>,
    )
  }

  if (buttons.length === 0) return null

  return (
    <div className="fixed right-6 bottom-6 z-60 flex flex-col-reverse items-end gap-3">
      {buttons}
    </div>
  )
}
