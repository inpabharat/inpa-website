import { describe, expect, it } from 'vitest'
import { nuclearInstitutions } from '../../content/site/institutions'
import { fitInstitutionMapView, groupInstitutionMarkers, institutionRegionCanvasHeight, mapGraticule, maximumMapZoom, nationalMapView, pointInMapView, projectInstitutionPoint, projectMapCoordinates, separateInstitutionMarkers, zoomInstitutionMapView } from '../../shared/utils/institution-map'

describe('geographic institution map', () => {
  it.each([260, 288, 700, 900])('keeps each institution in one selectable national target at %i px', (width) => {
    const groups = groupInstitutionMarkers(nuclearInstitutions, width)
    const ids = groups.flatMap(group => group.institutions.map(institution => institution.id))
    expect(ids.sort()).toEqual(nuclearInstitutions.map(institution => institution.id).sort())
    expect(new Set(ids).size).toBe(ids.length)
    for (let first = 0; first < groups.length; first += 1) {
      const left = groups[first]!
      for (const right of groups.slice(first + 1)) {
        expect(Math.hypot((left.x - right.x) * width / 100, (left.y - right.y) * width * 725 / 700 / 100)).toBeGreaterThanOrEqual(44)
      }
    }
  })

  it.each([260, 288, 700, 900])('fits crowded regions without changing their source positions at %i px', (width) => {
    for (const group of groupInstitutionMarkers(nuclearInstitutions, width).filter(group => group.institutions.length > 1)) {
      const view = fitInstitutionMapView(group.institutions, width)
      expect(view.scale).toBeGreaterThanOrEqual(1)
      expect(view.scale).toBeLessThanOrEqual(maximumMapZoom)
      const zoomed = groupInstitutionMarkers(group.institutions, width, view)
      expect(zoomed.flatMap(target => target.institutions.map(institution => institution.id)).sort()).toEqual(group.institutions.map(institution => institution.id).sort())
      for (const institution of group.institutions) {
        const source = projectInstitutionPoint(institution)
        const screen = pointInMapView(source, view)
        expect(screen.x).toBeGreaterThan(2)
        expect(screen.x).toBeLessThan(98)
        expect(screen.y).toBeGreaterThan(3)
        expect(screen.y).toBeLessThan(98)
        expect(screen.x / view.scale + view.x).toBeCloseTo(source.x, 10)
        expect(screen.y / view.scale + view.y).toBeCloseTo(source.y, 10)
      }
    }
  })

  it('uses the source coordinate even when legacy display offsets exist', () => {
    const institution = { ...nuclearInstitutions[0]!, markerOffset: { x: 10, y: -10 } }
    const [marker] = groupInstitutionMarkers([institution], 700)
    expect(marker?.x).toBeCloseTo(projectInstitutionPoint(institution).x, 10)
    expect(marker?.y).toBeCloseTo(projectInstitutionPoint(institution).y, 10)
  })

  it.each([260, 700])('separates colocated targets locally and retains their exact anchors at %i px', (width) => {
    const original = nuclearInstitutions[0]!
    const colocated = Array.from({ length: 7 }, (_, index) => ({ ...original, id: 'colocated-' + index }))
    const view = fitInstitutionMapView(colocated, width)
    const markers = separateInstitutionMarkers(colocated, width, view)
    expect(markers).toHaveLength(colocated.length)
    expect(markers).toEqual(separateInstitutionMarkers(colocated, width, view))
    for (let first = 0; first < markers.length; first += 1) {
      const marker = markers[first]!
      expect({ x: marker.anchorX, y: marker.anchorY }).toEqual(pointInMapView(projectInstitutionPoint(marker.institution), view))
      expect(marker.x).toBeGreaterThan(2)
      expect(marker.x).toBeLessThan(98)
      for (const other of markers.slice(first + 1)) {
        expect(Math.hypot((marker.x - other.x) * width / 100, (marker.y - other.y) * width * 725 / 700 / 100)).toBeGreaterThanOrEqual(38)
      }
    }
  })

  it('does not move separated source positions when no collision exists', () => {
    const first = nuclearInstitutions[0]!
    const institutions = [first, { ...first, id: 'separate', coordinates: { latitude: first.coordinates.latitude + 0.25, longitude: first.coordinates.longitude + 0.25 } }]
    const view = fitInstitutionMapView(institutions, 700)
    for (const marker of separateInstitutionMarkers(institutions, 700, view)) {
      expect(marker.x).toBeCloseTo(marker.anchorX, 10)
      expect(marker.y).toBeCloseTo(marker.anchorY, 10)
    }
  })

  it('limits zoom, preserves the focal point and handles empty filters', () => {
    expect(groupInstitutionMarkers([], 288)).toEqual([])
    expect(fitInstitutionMapView([], 288)).toEqual(nationalMapView)
    expect(separateInstitutionMarkers([], 288, nationalMapView)).toEqual([])
    const view = fitInstitutionMapView(nuclearInstitutions.slice(0, 2), 700)
    const zoom = zoomInstitutionMapView(view, 1.5)
    expect(zoom.x + 50 / zoom.scale).toBeCloseTo(view.x + 50 / view.scale)
    expect(zoom.y + 57 / zoom.scale).toBeCloseTo(view.y + 57 / view.scale)
    expect(zoomInstitutionMapView(view, 100).scale).toBe(maximumMapZoom)
    expect(zoomInstitutionMapView(view, 0.01)).toEqual(nationalMapView)
  })

  it('places coordinate guides using the same projection as institution markers', () => {
    const view = fitInstitutionMapView(nuclearInstitutions.slice(12, 16), 288)
    const guides = mapGraticule(view)
    expect(guides.longitude.length).toBeGreaterThan(0)
    expect(guides.latitude.length).toBeGreaterThan(0)
    for (const guide of guides.longitude) {
      expect(guide.position).toBeCloseTo(pointInMapView(projectMapCoordinates({ longitude: Number.parseFloat(guide.label), latitude: 0 }), view).x)
    }
    for (const guide of guides.latitude) {
      expect(guide.position).toBeCloseTo(pointInMapView(projectMapCoordinates({ longitude: 0, latitude: Number.parseFloat(guide.label) }), view).y)
    }
  })

  it.each([201, 260, 271, 288, 700, 900])('reveals every member in a single zoom with local collision offsets at %i px', (width) => {
    for (const group of groupInstitutionMarkers(nuclearInstitutions, width).filter(group => group.institutions.length > 1)) {
      const height = institutionRegionCanvasHeight(group.institutions.length, width)
      const view = fitInstitutionMapView(group.institutions, width, height)
      const markers = separateInstitutionMarkers(group.institutions, width, view, height)
      expect(markers.map(marker => marker.institution.id).sort()).toEqual(group.institutions.map(institution => institution.id).sort())
      for (let index = 0; index < markers.length; index++) {
        const marker = markers[index]!
        const x = marker.x * width / 100, y = marker.y * height / 100
        expect(x).toBeGreaterThanOrEqual(24 - 1e-8)
        expect(y).toBeGreaterThanOrEqual(80 - 1e-8)
        expect(x).toBeLessThanOrEqual(width - 24 + 1e-8)
        for (const other of markers.slice(index + 1)) {
          expect(Math.hypot(x - other.x * width / 100, y - other.y * height / 100)).toBeGreaterThanOrEqual(42 - 1e-8)
        }
      }
    }
  })
})
