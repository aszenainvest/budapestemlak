/** English dates for the public site (blog cards, post hero, etc.). */
const BLOG_DATE_LOCALE = 'en-US'

export const formatDateTime = (timestamp: string): string => {
  if (!timestamp) return ''

  return new Intl.DateTimeFormat(BLOG_DATE_LOCALE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(timestamp))
}
