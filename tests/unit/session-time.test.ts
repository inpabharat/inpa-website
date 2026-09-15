import { describe, expect, it } from 'vitest'
import { formatSessionTime } from '../../shared/utils/session-time'

describe('editor session time', () => {
  it('formats a session countdown as a stable clock', () => {
    expect(formatSessionTime(3_661)).toBe('01:01:01')
    expect(formatSessionTime(90_061)).toBe('1d 01:01:01')
  })

  it('does not display negative time', () => {
    expect(formatSessionTime(-1)).toBe('00:00:00')
  })
})
