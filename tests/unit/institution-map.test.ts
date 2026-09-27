import { describe, expect, it } from 'vitest'
import { nuclearInstitutions } from '../../content/site/institutions'
import { groupInstitutionMarkers } from '../../shared/utils/institution-map'

describe('responsive institution map grouping', () => {
  it.each([288, 700, 900])('keeps every institution selectable without overlapping targets at %i px', (width) => {
    const groups = groupInstitutionMarkers(nuclearInstitutions, width)
    const ids = groups.flatMap(group => group.institutions.map(institution => institution.id))
    expect(ids.sort()).toEqual(nuclearInstitutions.map(institution => institution.id).sort())
    expect(new Set(ids).size).toBe(ids.length)

    for (let first = 0; first < groups.length; first += 1) {
      const left = groups[first]!
      expect(left.x).toBeGreaterThan(0)
      expect(left.x).toBeLessThan(100)
      expect(left.y).toBeGreaterThan(0)
      expect(left.y).toBeLessThan(100)
      for (const right of groups.slice(first + 1)) {
        const separation = Math.hypot((left.x - right.x) * width / 100, (left.y - right.y) * width * 725 / 700 / 100)
        expect(separation).toBeGreaterThanOrEqual(42)
      }
    }
  })

  it('groups crowded locations and still handles empty or single-result filters', () => {
    expect(groupInstitutionMarkers(nuclearInstitutions, 288).some(group => group.institutions.length > 1)).toBe(true)
    expect(groupInstitutionMarkers([], 288)).toEqual([])
    expect(groupInstitutionMarkers(nuclearInstitutions.slice(0, 1), 288)[0]?.institutions[0]?.id).toBe(nuclearInstitutions[0]?.id)
  })
})
