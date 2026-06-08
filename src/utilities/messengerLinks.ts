/** Build href for floating messenger buttons (WhatsApp, Botim, IMO). */
export function digitsOnly(phone?: string | null): string {
  return phone?.replace(/\D/g, '') ?? ''
}

export function resolveWhatsAppHref(phone?: string | null): string | null {
  const digits = digitsOnly(phone)
  return digits.length > 0 ? `https://wa.me/${digits}` : null
}

/**
 * Botim has no public wa.me-style API. Prefer a share link from the app; otherwise try mobile deep link.
 */
export function resolveBotimHref(
  contactUrl?: string | null,
  phone?: string | null,
): string | null {
  const url = contactUrl?.trim()
  if (url && isAllowedHref(url)) return url

  const digits = digitsOnly(phone)
  if (digits.length > 0) return `botim://chat?phone=${digits}`

  return null
}

/**
 * IMO: paste Global Web Call / share link from the app when possible.
 * Phone-only fallback uses imo:// (works on some devices when the app is installed).
 */
export function resolveImoHref(contactUrl?: string | null, phone?: string | null): string | null {
  const url = contactUrl?.trim()
  if (url && isAllowedHref(url)) return url

  const digits = digitsOnly(phone)
  if (digits.length > 0) return `imo://chat?phone=${digits}`

  return null
}

function isAllowedHref(value: string): boolean {
  return /^https?:\/\//i.test(value) || /^[a-z][a-z0-9+.-]*:/i.test(value)
}
