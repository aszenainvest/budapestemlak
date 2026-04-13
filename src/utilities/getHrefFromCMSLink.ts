type CMSLinkFields = {
  type?: ('reference' | 'custom') | null
  reference?: {
    relationTo: 'pages' | 'posts' | 'properties'
    value: unknown
  } | null
  url?: string | null
}

function isDocWithSlug(val: unknown): val is { slug: string } {
  return (
    typeof val === 'object' &&
    val !== null &&
    'slug' in val &&
    typeof (val as { slug: unknown }).slug === 'string' &&
    Boolean((val as { slug: string }).slug)
  )
}

function normalizeCustomHref(url: string): string {
  const t = url.trim()
  if (!t) return ''
  if (/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(t)) return t
  return `/${t}`
}

/**
 * Resolves navigation href for Payload link groups (reference or custom URL).
 * Reference values that are still IDs (unpopulated) yield ''.
 */
export function getHrefFromCMSLink(link: CMSLinkFields | null | undefined): string {
  if (!link) return ''

  const { type, reference, url } = link

  if (type === 'reference' && reference?.value != null) {
    const val = reference.value
    if (isDocWithSlug(val)) {
      if (reference.relationTo === 'pages') return `/${val.slug}`
      if (reference.relationTo === 'posts') return `/posts/${val.slug}`
      if (reference.relationTo === 'properties') return `/properties/${val.slug}`
    }
  }

  if (type === 'custom' && url != null && url !== '') {
    return normalizeCustomHref(String(url))
  }

  return ''
}
