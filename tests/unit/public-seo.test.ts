import { describe, expect, it } from 'vitest'
import { getCanonicalUrl } from '../../shared/utils/public-seo'

describe('public canonical URLs', () => {
  const origin = 'https://inpa-website.inpa-website.workers.dev/'

  it('normalises trailing slashes and excludes query/anchor navigation state', () => {
    expect(getCanonicalUrl(origin, '/map/?area=theory#institutions')).toBe(`${origin}map`)
    expect(getCanonicalUrl(origin, '/')).toBe(origin)
    expect(getCanonicalUrl(origin, '/research/approved-feature')).toBe(`${origin}research/approved-feature`)
  })

  it('does not advertise protected editors or API endpoints as public pages', () => {
    for (const path of ['/admin', '/admin/', '/admin/editor', '/api/public/home', '/api/admin/news']) {
      expect(getCanonicalUrl(origin, path)).toBeNull()
    }
  })

  it('uses the configured origin, including a future approved domain', () => {
    expect(getCanonicalUrl('https://example.org/', '/about')).toBe('https://example.org/about')
  })
})
