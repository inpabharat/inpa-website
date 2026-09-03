import { setResponseHeader } from 'h3'
import { pendingRoutes } from '../../content/site/routes'

function escapeXml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;')
}

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = String(config.public.siteUrl).replace(/\/$/, '')
  setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=86400')

  const paths = [
    '/',
    '/activities/young-scientist-colloquium',
    '/map',
    ...Object.entries(pendingRoutes)
      .filter(([, content]) => content.indexable)
      .map(([path]) => path),
  ].sort()
  const urls = [...new Set(paths)]
    .map(path => `  <url><loc>${escapeXml(`${siteUrl}${path}`)}</loc></url>`)
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
})
