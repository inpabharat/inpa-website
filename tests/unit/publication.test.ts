import { describe, expect, it } from 'vitest'
import { isEventPublic, isNewsPublic, isUpcomingEvent } from '../../shared/utils/publication'

const now = new Date('2026-08-01T12:00:00.000Z')

describe('public content status rules', () => {
  it('does not expose drafts or expired news', () => {
    expect(isNewsPublic({ status: 'draft', publishAt: null, publishedAt: null, expiresAt: null }, now)).toBe(false)
    expect(isNewsPublic({
      status: 'published',
      publishAt: null,
      publishedAt: '2026-07-01T00:00:00.000Z',
      expiresAt: '2026-07-31T23:59:59.000Z',
    }, now)).toBe(false)
  })

  it('accepts currently published news', () => {
    expect(isNewsPublic({
      status: 'published',
      publishAt: null,
      publishedAt: '2026-07-01T00:00:00.000Z',
      expiresAt: null,
    }, now)).toBe(true)
  })

  it('keeps public event notices visible for postponed and cancelled states', () => {
    expect(isEventPublic({ status: 'postponed', publishAt: null, startAt: '2026-09-01T00:00:00.000Z' }, now)).toBe(true)
    expect(isEventPublic({ status: 'cancelled', publishAt: null, startAt: '2026-09-01T00:00:00.000Z' }, now)).toBe(true)
  })

  it('separates future events from the archive', () => {
    expect(isUpcomingEvent('2026-08-02T00:00:00.000Z', now)).toBe(true)
    expect(isUpcomingEvent('2026-07-31T00:00:00.000Z', now)).toBe(false)
  })
})
