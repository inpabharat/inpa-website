import { describe, expect, it } from 'vitest'
import { localCalendarDate, localDateTimeToIso, toDateTimeLocal } from '../../shared/utils/editor-date'

describe('editor local date fields', () => {
  it('round-trips a local date and time through UTC storage', () => {
    const localValue = '2026-09-15T17:40'
    expect(toDateTimeLocal(localDateTimeToIso(localValue))).toBe(localValue)
  })

  it('keeps optional and invalid values empty', () => {
    expect(localDateTimeToIso(null)).toBeNull()
    expect(localDateTimeToIso('not-a-date')).toBeNull()
    expect(toDateTimeLocal(null)).toBeNull()
  })

  it('uses the editor’s local calendar date', () => {
    const instant = new Date('2026-09-15T23:30:00.000Z')
    expect(localCalendarDate(instant)).toBe(toDateTimeLocal(instant.toISOString())?.slice(0, 10))
  })
})
