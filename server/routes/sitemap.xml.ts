import { setResponseHeader } from 'h3'
import { pendingRoutes } from '../../content/site/routes'
import { useDatabase } from '../database/client'
import { ScienceRepository } from '../repositories/science.repository'

function escapeXml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;')
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = String(config.public.siteUrl).replace(/\/$/, '')
  setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=0, s-maxage=60, must-revalidate')
  const database = useDatabase(event)
  const research = database ? await new ScienceRepository(database).listPublishedResearch(new Date().toISOString().slice(0, 10)) : []

  const paths = [
    '/',
    '/activities/young-scientist-colloquium',
    '/map',
    '/nuclear-horizons',
    '/nuclear-horizons/archive',
    ...(research.length ? ['/research', ...research.map(item => `/research/${item.slug}`)] : []),
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
