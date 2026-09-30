import { describe, expect, it } from 'vitest'
import states from '../../public/maps/states.json'
import districts from '../../public/maps/districts.json'
import { administrativeBoundaryLabels, visibleAdministrativeBoundaries, type AdministrativeBoundaryLayer } from '../../shared/utils/map-boundaries'
import { fitInstitutionMapView, nationalMapView } from '../../shared/utils/institution-map'
import { nuclearInstitutions } from '../../content/site/institutions'

const layers = [states, districts] as unknown as AdministrativeBoundaryLayer[]
describe('local administrative reference layers', () => {
  it('retains source identities, dates, licences and valid projected polygons', () => {
    expect(states.features).toHaveLength(36)
    expect(districts.features).toHaveLength(735)
    expect(states.outline.startsWith('M ')).toBe(true)
    for (const layer of layers) {
      expect(layer.license.length).toBeGreaterThan(5)
      expect(new Set(layer.features.map(feature => feature.id)).size).toBe(layer.features.length)
      for (const feature of layer.features) {
        expect(feature.path).toMatch(/^M.+Z$/)
        expect(feature.path).not.toContain('NaN')
        expect(feature.bounds[2]).toBeGreaterThan(feature.bounds[0])
        expect(feature.bounds[3]).toBeGreaterThan(feature.bounds[1])
      }
    }
  })
  it('culls boundaries outside the regional viewport and protects marker labels', () => {
    const view = fitInstitutionMapView(nuclearInstitutions.slice(12, 16), 700)
    const visible = visibleAdministrativeBoundaries(layers[1]!, view)
    expect(visible.length).toBeGreaterThan(0)
    expect(visible.length).toBeLessThan(districts.features.length / 2)
    const labels = administrativeBoundaryLabels(visible, view, 700, [])
    expect(labels.length).toBeGreaterThan(0)
    const reserved = labels.map(({ x, y }) => ({ x, y }))
    const protectedLabels = administrativeBoundaryLabels(visible, view, 700, reserved)
    expect(protectedLabels.some(label => labels.some(original => original.id === label.id))).toBe(false)
    expect(visibleAdministrativeBoundaries(null, nationalMapView)).toEqual([])
  })
})
