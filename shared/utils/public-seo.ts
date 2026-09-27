/** Public pages canonicalise to the configured site, without navigation/filter state. */
export function getCanonicalUrl(siteUrl: string, routePath: string): string | null {
  const path = routePath.split(/[?#]/, 1)[0]?.replace(/\/+$/, '') || '/'
  if (/^\/(admin|api)(\/|$)/.test(path)) return null
  const url = new URL(siteUrl)
  if (!['http:', 'https:'].includes(url.protocol)) return null
  url.pathname = path
  url.search = ''
  url.hash = ''
  return url.href
}
