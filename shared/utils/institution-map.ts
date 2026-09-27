import type { NuclearInstitution } from '../../content/site/institutions'

const bounds = {
  minLongitude: 68.179,
  maxLongitude: 97.413,
  minLatitude: 6.755,
  maxLatitude: 37.087,
  horizontalMargin: 1.714,
  verticalMargin: 1.655,
  drawableWidth: 96.572,
  drawableHeight: 96.69,
} as const

export interface InstitutionMarkerGroup {
  id: string
  x: number
  y: number
  institutions: NuclearInstitution[]
}

/** Group overlapping targets at the rendered map size, without changing source coordinates. */
export function groupInstitutionMarkers(institutions: readonly NuclearInstitution[], mapWidth: number): InstitutionMarkerGroup[] {
  const width = Math.max(1, mapWidth)
  const height = width * 725 / 700
  const targetSeparation = 42
  let groups: InstitutionMarkerGroup[] = institutions.map(institution => ({
    id: institution.id,
    x: bounds.horizontalMargin + (institution.coordinates.longitude - bounds.minLongitude)
      / (bounds.maxLongitude - bounds.minLongitude) * bounds.drawableWidth + (institution.markerOffset?.x ?? 0),
    y: bounds.verticalMargin + (bounds.maxLatitude - institution.coordinates.latitude)
      / (bounds.maxLatitude - bounds.minLatitude) * bounds.drawableHeight + (institution.markerOffset?.y ?? 0),
    institutions: [institution],
  }))

  // Repeat after merging because a group's new centre can overlap another target.
  let merged = true
  while (merged) {
    merged = false
    for (let first = 0; first < groups.length && !merged; first += 1) {
      for (let second = first + 1; second < groups.length; second += 1) {
        const left = groups[first]!
        const right = groups[second]!
        if (Math.hypot((left.x - right.x) * width / 100, (left.y - right.y) * height / 100) >= targetSeparation) continue

        const members = [...left.institutions, ...right.institutions]
        const total = members.length
        groups[first] = {
          id: members.map(institution => institution.id).sort().join('-'),
          x: (left.x * left.institutions.length + right.x * right.institutions.length) / total,
          y: (left.y * left.institutions.length + right.y * right.institutions.length) / total,
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
