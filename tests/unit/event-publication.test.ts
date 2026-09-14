import { describe, expect, it } from 'vitest'
import { isEventPublic } from '../../shared/utils/publication'

describe('event publication states', () => {
  it('publishes published events immediately', () => {
    expect(isEventPublic({ status: 'published', publishAt: '2099-01-01T00:00:00.000Z', startAt: '2026-09-26T00:00:00.000Z' })).toBe(true)
  })
  it('keeps scheduled events private until publication time', () => {
    expect(isEventPublic({ status: 'scheduled', publishAt: '2099-01-01T00:00:00.000Z', startAt: '2026-09-26T00:00:00.000Z' })).toBe(false)
  })
})
