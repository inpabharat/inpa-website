import { pointInMapView, type MapView } from './institution-map'

export interface AdministrativeBoundary {
  id: string
  name: string
  path: string
  bounds: [number, number, number, number]
  centre: { x: number, y: number }
}
export interface AdministrativeBoundaryLayer {
  outline?: string
  year: string
  source: string
  license: string
  features: AdministrativeBoundary[]
}
export function visibleAdministrativeBoundaries(layer: AdministrativeBoundaryLayer | null, view: MapView, heightRatio = 1): AdministrativeBoundary[] {
  return layer?.features.filter(({ bounds }) => bounds[2] >= view.x && bounds[0] <= view.x + 100 / view.scale && bounds[3] >= view.y && bounds[1] <= view.y + 100 * heightRatio / view.scale) ?? []
}
export function administrativeBoundaryLabels(features: AdministrativeBoundary[], view: MapView, width: number, reservedPoints: Array<{ x: number, y: number }>, height = width * 725 / 700): Array<{ id: string, name: string, x: number, y: number }> {
  const placed: Array<{ id: string, name: string, x: number, y: number }> = []
  for (const feature of [...features].sort((a, b) => (b.bounds[2] - b.bounds[0]) * (b.bounds[3] - b.bounds[1]) - (a.bounds[2] - a.bounds[0]) * (a.bounds[3] - a.bounds[1]))) {
    const point = pointInMapView(feature.centre, view)
    point.y *= width * 725 / 700 / height
    const textHalfWidth = Math.min(100, feature.name.length * 3.5)
    const pixel = { x: point.x * width / 100, y: point.y * height / 100 }
    if (pixel.x < textHalfWidth + 8 || pixel.x > width - textHalfWidth - 8 || pixel.y < 90 || pixel.y > height - 120) continue
    if (reservedPoints.some(marker => Math.abs(marker.x * width / 100 - pixel.x) < textHalfWidth + 24 && Math.abs(marker.y * height / 100 - pixel.y) < 30)) continue
    if (placed.some(label => Math.abs((label.x - point.x) * width / 100) < textHalfWidth + Math.min(100, label.name.length * 3.5) + 8 && Math.abs((label.y - point.y) * height / 100) < 26)) continue
    placed.push({ id: feature.id, name: feature.name, ...point })
  }
  return placed
}
