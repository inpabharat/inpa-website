import { describe, expect, it } from 'vitest'
import { editorTimeOptions, localCalendarDate, localDateTimeToIso, minimumEndDate, normaliseEditorTime, toDateTimeLocal } from '../../shared/utils/editor-date'

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

  it('accepts a typed local time with or without a colon', () => {
    expect(normaliseEditorTime('930')).toBe('09:30')
    expect(normaliseEditorTime('9:30')).toBe('09:30')
    expect(normaliseEditorTime('24:00')).toBeNull()
    expect(normaliseEditorTime('13:60')).toBeNull()
    expect(localDateTimeToIso('2026-11-19T930')).toBe(localDateTimeToIso('2026-11-19T09:30'))
    expect(localDateTimeToIso('2026-02-30T09:30')).toBeNull()
  })

  it('offers strictly later time choices on the same day and all times on a later day', () => {
    const start = '2026-11-19T1430'
    expect(minimumEndDate(start)).toBe('2026-11-19')
    expect(editorTimeOptions('2026-11-18', start)).toEqual([])
    expect(editorTimeOptions('2026-11-19', start).slice(0, 3)).toEqual(['14:31', '14:45', '15:00'])
    expect(editorTimeOptions('2026-11-20', start)[0]).toBe('00:00')
    expect(editorTimeOptions('2026-11-19', '2026-11-19T23:58')).toEqual(['23:59'])
  })

  it('rolls the earliest end date over at the last minute of the day', () => {
    const start = '2026-12-31T23:59'
    expect(minimumEndDate(start)).toBe('2027-01-01')
    expect(editorTimeOptions('2026-12-31', start)).toEqual([])
    expect(editorTimeOptions('2027-01-01', start)[0]).toBe('00:00')
  })
})
