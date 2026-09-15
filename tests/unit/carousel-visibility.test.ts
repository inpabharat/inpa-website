import { describe, expect, it } from 'vitest'
import { getCarouselVisibility } from '../../shared/utils/carousel-visibility'

const now = new Date('2026-09-15T12:10:00.000Z')

describe('homepage slide visibility', () => {
  it('distinguishes enabled from currently visible', () => {
    expect(getCarouselVisibility({ isActive: true, startsAt: null, endsAt: null }, now).state).toBe('live')
    expect(getCarouselVisibility({ isActive: false, startsAt: null, endsAt: null }, now).state).toBe('inactive')
  })

  it('explains schedule boundaries', () => {
    expect(getCarouselVisibility({ isActive: true, startsAt: '2026-09-15T12:11:00.000Z', endsAt: null }, now).state).toBe('scheduled')
    expect(getCarouselVisibility({ isActive: true, startsAt: null, endsAt: '2026-09-15T12:10:00.000Z' }, now).state).toBe('expired')
  })
})
