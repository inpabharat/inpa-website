import { describe, expect, it } from 'vitest'
import { institutionCategories, nuclearInstitutions } from '../../content/site/institutions'

describe('nuclear institution directory', () => {
  it('contains unique institution identifiers and official HTTPS destinations', () => {
    const identifiers = nuclearInstitutions.map(institution => institution.id)

    expect(new Set(identifiers).size).toBe(identifiers.length)
    expect(nuclearInstitutions.length).toBe(13)
    expect(nuclearInstitutions.every(institution => institution.officialUrl.startsWith('https://'))).toBe(true)
  })

  it('keeps every marker and category within supported bounds', () => {
    const supportedCategories = new Set(institutionCategories.map(category => category.id))

    for (const institution of nuclearInstitutions) {
      expect(supportedCategories.has(institution.category)).toBe(true)
      expect(institution.coordinates.longitude).toBeGreaterThanOrEqual(68.179)
      expect(institution.coordinates.longitude).toBeLessThanOrEqual(97.413)
      expect(institution.coordinates.latitude).toBeGreaterThanOrEqual(6.755)
      expect(institution.coordinates.latitude).toBeLessThanOrEqual(37.087)
    }
  })
})
