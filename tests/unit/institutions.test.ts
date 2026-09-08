import { describe, expect, it } from 'vitest'
import { institutionCategories, nuclearInstitutions } from '../../content/site/institutions'

describe('nuclear institution directory', () => {
  it('contains unique institution and linked-record identifiers', () => {
    const identifiers = nuclearInstitutions.map(institution => institution.id)

    expect(new Set(identifiers).size).toBe(identifiers.length)
    expect(nuclearInstitutions.length).toBeGreaterThanOrEqual(39)
    expect(nuclearInstitutions.filter(institution => institution.verificationStatus === 'verified-v1').length).toBeGreaterThanOrEqual(26)
    expect(nuclearInstitutions.flatMap(institution => institution.researchers ?? []).every(researcher => researcher.id.length > 0)).toBe(true)
    expect(nuclearInstitutions.flatMap(institution => institution.facilities ?? []).every(facility => facility.id.length > 0)).toBe(true)
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
