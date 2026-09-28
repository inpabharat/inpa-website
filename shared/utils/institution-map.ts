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

export interface ExpandedInstitutionMarker {
  institution: NuclearInstitution
  x: number
  y: number
  anchorX: number
  anchorY: number
}

/** Percent coordinates of the institution's approximate source location, without display offsets. */
export function projectInstitutionPoint(institution: NuclearInstitution): { x: number, y: number } {
  return {
    x: bounds.horizontalMargin + (institution.coordinates.longitude - bounds.minLongitude)
      / (bounds.maxLongitude - bounds.minLongitude) * bounds.drawableWidth,
    y: bounds.verticalMargin + (bounds.maxLatitude - institution.coordinates.latitude)
      / (bounds.maxLatitude - bounds.minLatitude) * bounds.drawableHeight,
  }
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value))
}

/** Spread a selected group into numbered targets while retaining each source point for a leader line. */
export function expandInstitutionMarkerGroup(group: InstitutionMarkerGroup, mapWidth: number): ExpandedInstitutionMarker[] {
  const width = Math.max(1, mapWidth)
  const height = width * 725 / 700
  const topInset = 60
  const otherInset = 20
  const members = group.institutions.map(institution => ({ institution, anchor: projectInstitutionPoint(institution) }))
  const count = members.length
  if (count === 0) return []

  let positions: Array<{ x: number, y: number }>
  if (count <= 9) {
    const radius = count === 1 ? 0 : Math.min(
      44 / (2 * Math.sin(Math.PI / count)),
      Math.max(0, (width - 2 * otherInset) / 2),
      Math.max(0, (height - topInset - otherInset) / 2),
    )
    const centreX = clamp(group.x * width / 100, otherInset + radius, width - otherInset - radius)
    const centreY = clamp(group.y * height / 100, topInset + radius, height - otherInset - radius)
    members.sort((first, second) => {
      const angle = (point: { x: number, y: number }) =>
        (Math.atan2(point.y - group.y, point.x - group.x) + Math.PI * 2.5) % (Math.PI * 2)
      return angle(first.anchor) - angle(second.anchor)
    })
    positions = members.map((_, index) => {
      const angle = -Math.PI / 2 + index * Math.PI * 2 / count
      return { x: centreX + radius * Math.cos(angle), y: centreY + radius * Math.sin(angle) }
    })
  } else {
    // Dense phone groups use the map area as a focused numbered layout.
    members.sort((first, second) => first.anchor.y - second.anchor.y || first.anchor.x - second.anchor.x)
    const columns = Math.min(count, Math.ceil(Math.sqrt(count * width / height)))
    const rows = Math.ceil(count / columns)
    const step = Math.max(0, Math.min(
      44,
      (width - 2 * otherInset) / Math.max(1, columns - 1),
      (height - topInset - otherInset) / Math.max(1, rows - 1),
    ))
    const centreX = clamp(group.x * width / 100, otherInset + (columns - 1) * step / 2, width - otherInset - (columns - 1) * step / 2)
    const centreY = clamp(group.y * height / 100, topInset + (rows - 1) * step / 2, height - otherInset - (rows - 1) * step / 2)
    positions = members.map((_, index) => ({
      x: centreX + (index % columns - (columns - 1) / 2) * step,
      y: centreY + (Math.floor(index / columns) - (rows - 1) / 2) * step,
    }))
  }

  return members.map(({ institution, anchor }, index) => ({
    institution,
    x: positions[index]!.x / width * 100,
    y: positions[index]!.y / height * 100,
    anchorX: anchor.x,
    anchorY: anchor.y,
  }))
}

/** Group overlapping targets at the rendered map size, without changing source coordinates. */
export function groupInstitutionMarkers(institutions: readonly NuclearInstitution[], mapWidth: number): InstitutionMarkerGroup[] {
  const width = Math.max(1, mapWidth)
  const height = width * 725 / 700
  const targetSeparation = 42
  let groups: InstitutionMarkerGroup[] = institutions.map((institution) => {
    const point = projectInstitutionPoint(institution)
    return {
      id: institution.id,
      x: point.x + (institution.markerOffset?.x ?? 0),
      y: point.y + (institution.markerOffset?.y ?? 0),
      institutions: [institution],
    }
  })

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
