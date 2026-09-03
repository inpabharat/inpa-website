import { describe, expect, it } from 'vitest'
import { ContentValidationError, makeSlug, parseCarouselInput, parseEventInput, parseNewsInput } from '../../shared/utils/content-validation'

const news = {
  slug: 'verified-update', title: 'Verified update', summary: 'A concise approved summary.', body: 'Approved body text.',
  coverImageKey: null, coverImageAlt: null, category: null, status: 'draft', isFeatured: false,
  publishAt: null, publishedAt: null, expiresAt: null, externalUrl: null,
}

describe('content validation', () => {
  it('creates stable human-readable slugs', () => {
    expect(makeSlug('  Nuclear Horizons: Issue 2  ')).toBe('nuclear-horizons-issue-2')
  })

  it('accepts a complete draft news item', () => {
    expect(parseNewsInput(news).slug).toBe('verified-update')
  })

  it('requires a date for scheduled news', () => {
    expect(() => parseNewsInput({ ...news, status: 'scheduled' })).toThrow(ContentValidationError)
  })

  it('requires image alternative text with an image key', () => {
    expect(() => parseNewsInput({ ...news, coverImageKey: 'uploads/2026/09/file.jpg' })).toThrow(/alternative text/i)
  })

  it('rejects an event whose end precedes its start', () => {
    expect(() => parseEventInput({
      ...news,
      startAt: '2026-09-03T10:00:00Z', endAt: '2026-09-03T09:00:00Z', timezone: 'Asia/Kolkata',
      locationName: null, isOnline: true,
    })).toThrow(/after the start/i)
  })

  it('requires complete carousel action pairs', () => {
    expect(() => parseCarouselInput({
      eyebrow: null, title: 'Slide', summary: null, imageKey: 'uploads/2026/09/file.jpg', imageAlt: 'Approved image.',
      ctaLabel: 'Read more', ctaUrl: null, linkedContentType: null, linkedContentId: null,
      sortOrder: 0, isActive: false, startsAt: null, endsAt: null,
    })).toThrow(/label and action URL/i)
  })
})
