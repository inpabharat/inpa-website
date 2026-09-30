import type { NuclearInstitution } from '../../content/site/institutions'

const bounds = {
  minLongitude: 68.179, maxLongitude: 97.413,
  minLatitude: 6.755, maxLatitude: 37.087,
  horizontalMargin: 1.714, verticalMargin: 1.655,
  drawableWidth: 96.572, drawableHeight: 96.69,
} as const

export interface MapView { x: number, y: number, scale: number }
export interface InstitutionMarkerGroup {
  id: string
  x: number
  y: number
  institutions: NuclearInstitution[]
}
export interface ExpandedInstitutionMarker {
  institution: NuclearInstitution
  x: number
  y: number
  anchorX: number
  anchorY: number
}
export const nationalMapView: MapView = { x: 0, y: 0, scale: 1 }
export const maximumMapZoom = 18

/** Reserve enough phone canvas area for one-step expansion and fixed controls. */
export function institutionRegionCanvasHeight(count: number, width: number): number {
  const columns = Math.max(1, Math.floor((width - 48) / 44))
  return Math.max(width * 725 / 700, 480, Math.ceil(count / columns) * 44 + 200)
}

/** Source coordinates on the generalized outline; never apply editorial marker offsets. */
export function projectInstitutionPoint(institution: NuclearInstitution): { x: number, y: number } {
  return projectMapCoordinates(institution.coordinates)
}

export function projectMapCoordinates(coordinates: { latitude: number, longitude: number }): { x: number, y: number } {
  return {
    x: bounds.horizontalMargin + (coordinates.longitude - bounds.minLongitude) / (bounds.maxLongitude - bounds.minLongitude) * bounds.drawableWidth,
    y: bounds.verticalMargin + (bounds.maxLatitude - coordinates.latitude) / (bounds.maxLatitude - bounds.minLatitude) * bounds.drawableHeight,
  }
}

export function mapGraticule(view: MapView, heightRatio = 1): { longitude: Array<{ position: number, label: string }>, latitude: Array<{ position: number, label: string }> } {
  const step = view.scale < 3 ? 5 : view.scale < 7 ? 2 : view.scale < 14 ? 1 : 0.5
  const longitude = []
  const latitude = []
  for (let value = 65; value <= 100; value += step) {
    const position = pointInMapView(projectMapCoordinates({ longitude: value, latitude: 0 }), view).x
    if (position > 4 && position < 96) longitude.push({ position, label: `${value}° E` })
  }
  for (let value = 5; value <= 40; value += step) {
    const position = pointInMapView(projectMapCoordinates({ longitude: 0, latitude: value }), view).y / heightRatio
    if (position > 12 && position < 88) latitude.push({ position, label: `${value}° N` })
  }
  return { longitude, latitude }
}

export function pointInMapView(point: { x: number, y: number }, view: MapView): { x: number, y: number } {
  return { x: (point.x - view.x) * view.scale, y: (point.y - view.y) * view.scale }
}

/** Fit the source extent with room for fixed-size targets and map controls. */
export function fitInstitutionMapView(institutions: readonly NuclearInstitution[], mapWidth: number, mapHeight = mapWidth * 725 / 700): MapView {
  if (!institutions.length) return { ...nationalMapView }
  const width = Math.max(120, mapWidth)
  const height = Math.max(120, mapHeight)
  const naturalHeight = width * 725 / 700
  const points = institutions.map(projectInstitutionPoint)
  const minX = Math.min(...points.map(point => point.x))
  const maxX = Math.max(...points.map(point => point.x))
  const minY = Math.min(...points.map(point => point.y))
  const maxY = Math.max(...points.map(point => point.y))
  const scale = Math.max(1, Math.min(maximumMapZoom,
    (width - 80) / width * 100 / Math.max(0.1, maxX - minX),
    (height - 110) / naturalHeight * 100 / Math.max(0.1, maxY - minY),
  ))
  const centreY = (height / 2 + 15) / naturalHeight * 100
  return { x: (minX + maxX) / 2 - 50 / scale, y: (minY + maxY) / 2 - centreY / scale, scale }
}

export function zoomInstitutionMapView(view: MapView, factor: number, heightRatio = 1): MapView {
  const scale = Math.max(1, Math.min(maximumMapZoom, view.scale * factor))
  if (scale === 1) return { ...nationalMapView }
  return { x: view.x + 50 / view.scale - 50 / scale, y: view.y + 57 * heightRatio / view.scale - 57 * heightRatio / scale, scale }
}

/** Group overlapping targets in screen space, retaining every source coordinate. */
export function groupInstitutionMarkers(institutions: readonly NuclearInstitution[], mapWidth: number, view: MapView = nationalMapView, mapHeight = mapWidth * 725 / 700): InstitutionMarkerGroup[] {
  const width = Math.max(1, mapWidth)
  const height = Math.max(1, mapHeight)
  let groups: InstitutionMarkerGroup[] = institutions.map((institution) => {
    const point = pointInMapView(projectInstitutionPoint(institution), view)
    return { id: institution.id, x: point.x, y: point.y * width * 725 / 700 / height, institutions: [institution] }
  })
  let merged = true
  while (merged) {
    merged = false
    for (let first = 0; first < groups.length && !merged; first += 1) {
      for (let second = first + 1; second < groups.length; second += 1) {
        const left = groups[first]!
        const right = groups[second]!
        if (Math.hypot((left.x - right.x) * width / 100, (left.y - right.y) * height / 100) >= 44) continue
        const members = [...left.institutions, ...right.institutions]
        groups[first] = {
          id: members.map(institution => institution.id).sort().join('-'),
          x: (left.x * left.institutions.length + right.x * right.institutions.length) / members.length,
          y: (left.y * left.institutions.length + right.y * right.institutions.length) / members.length,
          institutions: members,
        }
        groups = groups.filter((_, index) => index !== second)
        merged = true
        break
      }
    }
  }
  return groups
}

/** Resolve only the final, inseparable cluster with the closest available screen positions. */
export function separateInstitutionMarkers(institutions: readonly NuclearInstitution[], mapWidth: number, view: MapView, mapHeight = mapWidth * 725 / 700): ExpandedInstitutionMarker[] {
  const width = Math.max(120, mapWidth)
  const height = Math.max(120, mapHeight)
  const placed: Array<{ x: number, y: number }> = []
  return [...institutions].sort((a, b) => a.coordinates.latitude - b.coordinates.latitude || a.coordinates.longitude - b.coordinates.longitude || a.id.localeCompare(b.id)).map((institution) => {
    const anchor = pointInMapView(projectInstitutionPoint(institution), view)
    anchor.y *= width * 725 / 700 / height
    const source = { x: anchor.x * width / 100, y: anchor.y * height / 100 }
    const candidates: Array<{ x: number, y: number, distance: number }> = []
    for (let row = -8; row <= 8; row += 1) {
      for (let column = -8; column <= 8; column += 1) {
        const x = source.x + column * 44
        const y = source.y + row * 44
        if (x < 24 || x > width - 24 || y < 80 || y > height - 24) continue
        if ((x < 120 && y > height - 140) || (x > width - 185 && y > height - 80)) continue
        candidates.push({ x, y, distance: column * column + row * row })
      }
    }
    candidates.sort((a, b) => a.distance - b.distance || a.y - b.y || a.x - b.x)
    const isAvailable = (candidate: { x: number, y: number }) => placed.every(point => Math.hypot(point.x - candidate.x, point.y - candidate.y) >= 42)
    let target = candidates.find(isAvailable)
    if (!target) {
      // A finer local search fills gaps left by irregular source coordinates.
      const remaining = []
      for (let y = 80; y <= height - 24; y += 6) {
        for (let x = 24; x <= width - 24; x += 6) {
          if ((x < 120 && y > height - 140) || (x > width - 185 && y > height - 80)) continue
          remaining.push({ x, y, distance: (x - source.x) ** 2 + (y - source.y) ** 2 })
        }
      }
      remaining.sort((a, b) => a.distance - b.distance)
      target = remaining.find(isAvailable)
    }
    target ??= { ...source, distance: 0 }
    placed.push(target)
    return { institution, x: target.x / width * 100, y: target.y / height * 100, anchorX: anchor.x, anchorY: anchor.y }
  })
}
