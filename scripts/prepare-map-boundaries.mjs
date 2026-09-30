// Run with Node >=22.18: node scripts/prepare-map-boundaries.mjs <download-directory>
// Source files: pinned geoBoundaries release 9469f09592ced973a3448cf66b6100b741b64c0d.
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { projectMapCoordinates } from '../shared/utils/institution-map.ts'

const input = process.argv[2]
if (!input) throw new Error('Pass the directory containing ADM1.geojson, ADM2.geojson and their metadata JSON files')
const output = new URL('../public/maps/', import.meta.url)
await mkdir(output, { recursive: true })
const outline = (await readFile(new URL('../public/images/india-outline.svg', import.meta.url), 'utf8')).match(/<path d="([^"]+)"/)[1]

function squaredSegmentDistance(point, start, end) {
  const dx = end[0] - start[0], dy = end[1] - start[1]
  const fraction = dx || dy ? Math.max(0, Math.min(1, ((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) / (dx * dx + dy * dy))) : 0
  return (point[0] - start[0] - fraction * dx) ** 2 + (point[1] - start[1] - fraction * dy) ** 2
}
function simplify(points, toleranceSquared) {
  let furthest = -1, distance = toleranceSquared
  for (let index = 1; index < points.length - 1; index++) {
    const candidate = squaredSegmentDistance(points[index], points[0], points.at(-1))
    if (candidate > distance) { distance = candidate; furthest = index }
  }
  if (furthest < 0) return [points[0], points.at(-1)]
  return [...simplify(points.slice(0, furthest + 1), toleranceSquared).slice(0, -1), ...simplify(points.slice(furthest), toleranceSquared)]
}
function ringAreaAndCentre(ring) {
  let area = 0, x = 0, y = 0
  for (let index = 0; index < ring.length - 1; index++) {
    const a = ring[index], b = ring[index + 1], cross = a[0] * b[1] - b[0] * a[1]
    area += cross; x += (a[0] + b[0]) * cross; y += (a[1] + b[1]) * cross
  }
  return { area: Math.abs(area), x: area ? x / (3 * area) : ring[0][0], y: area ? y / (3 * area) : ring[0][1] }
}

for (const [level, name] of [['ADM1', 'states'], ['ADM2', 'districts']]) {
  const source = JSON.parse(await readFile(join(input, level + '.geojson'), 'utf8'))
  const metadata = JSON.parse(await readFile(join(input, level + '-metadata.json'), 'utf8'))
  const features = source.features.map(feature => {
    const polygons = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates
    const largest = polygons.map(polygon => ringAreaAndCentre(polygon[0])).sort((a, b) => b.area - a.area)[0]
    const centre = projectMapCoordinates({ longitude: largest.x, latitude: largest.y })
    const points = polygons.flat(2).map(([longitude, latitude]) => projectMapCoordinates({ longitude, latitude }))
    const bounds = [Math.min(...points.map(point => point.x)), Math.min(...points.map(point => point.y)), Math.max(...points.map(point => point.x)), Math.max(...points.map(point => point.y))]
    const path = polygons.flatMap(polygon => polygon.map(ring => {
      const simplified = simplify(ring, 0.003 ** 2)
      // A tiny island or hole must still have a valid closed ring.
      const retained = simplified.length >= 4 ? simplified : ring
      return retained.map(([longitude, latitude], index) => {
        const point = projectMapCoordinates({ longitude, latitude })
        return `${index ? 'L' : 'M'}${(point.x * 7).toFixed(3)},${(point.y * 7.25).toFixed(3)}`
      }).join('') + 'Z'
    })).join('')
    return { id: feature.properties.shapeID, name: feature.properties.shapeName, path, bounds, centre }
  })
  const data = { source: metadata.boundarySource, year: metadata.boundaryYearRepresented, license: metadata.boundaryLicense, sourceUrl: metadata.simplifiedGeometryGeoJSON, modifications: 'Simplified at 0.003 degrees and projected onto the INPA generalized outline. Display clipped to the Survey of India outline.', ...(name === 'states' ? { outline } : {}), features }
  await writeFile(new URL(name + '.json', output), JSON.stringify(data) + '\n')
  await writeFile(new URL(level + '-source-metadata.json', output), JSON.stringify(metadata, null, 2) + '\n')
  console.log(`${name}: ${features.length} features, ${JSON.stringify(data).length} bytes`)
}
