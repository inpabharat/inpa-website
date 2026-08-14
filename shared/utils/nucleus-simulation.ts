export interface MotionBody {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  mass: number
}

export interface VelocityVector {
  vx: number
  vy: number
}

export interface Point {
  x: number
  y: number
}

export interface ProjectileCaptureState {
  hasImpacted: boolean
  timeSinceImpact: number
}

export interface AbsorptionVisualState {
  opacity: number
  scale: number
}

export function calculateCentralForce(
  distance: number,
  coreRadius: number,
  attractionRange: number,
  repulsionStrength = 760,
  attractionStrength = 82,
): number {
  if (distance <= 0 || coreRadius <= 0 || attractionRange <= coreRadius) return 0
  if (distance < coreRadius) {
    const compression = 1 - distance / coreRadius
    return -repulsionStrength * compression * compression
  }
  if (distance >= attractionRange) return 0

  const phase = (distance - coreRadius) / (attractionRange - coreRadius)
  return attractionStrength * Math.sin(Math.PI * phase) * (1 - 0.35 * phase)
}

export function calculateCoulombRepulsion(
  distance: number,
  softeningRadius: number,
  strength: number,
): number {
  if (distance < 0 || softeningRadius <= 0 || strength <= 0) return 0

  // The softening radius prevents a singular acceleration if two rendered
  // discs approach the same position. Negative follows this simulation's
  // convention for a force directed away from the other particle.
  return -strength / (distance * distance + softeningRadius * softeningRadius)
}

export function calculateMeanFieldRestoringAcceleration(
  distanceFromCentre: number,
  confinementRadius: number,
  bulkStrength = 12,
  surfaceStrength = 52,
): number {
  if (
    distanceFromCentre <= 0
    || confinementRadius <= 0
    || bulkStrength < 0
    || surfaceStrength < 0
  ) return 0

  const radialFraction = distanceFromCentre / confinementRadius
  const bulkRestoringAcceleration = bulkStrength * Math.pow(radialFraction, 1.5)
  const surfaceFraction = Math.max(0, (radialFraction - 0.7) / 0.3)
  const surfaceRestoringAcceleration = surfaceStrength * surfaceFraction * surfaceFraction

  return bulkRestoringAcceleration + surfaceRestoringAcceleration
}

export function isBodyOutsideViewport(
  body: MotionBody,
  width: number,
  height: number,
  margin = 0,
): boolean {
  return body.x + body.radius < -margin
    || body.x - body.radius > width + margin
    || body.y + body.radius < -margin
    || body.y - body.radius > height + margin
}

export function isProjectileAbsorbed(
  projectile: MotionBody & ProjectileCaptureState,
  nucleusCentre: Point,
  captureRadius: number,
  maximumCaptureSpeed: number,
  minimumCaptureTime: number,
): boolean {
  if (!projectile.hasImpacted || projectile.timeSinceImpact < minimumCaptureTime) return false

  const distanceFromCentre = Math.hypot(
    projectile.x - nucleusCentre.x,
    projectile.y - nucleusCentre.y,
  )
  const speed = Math.hypot(projectile.vx, projectile.vy)
  return distanceFromCentre <= captureRadius && speed <= maximumCaptureSpeed
}

export function calculateAbsorptionVisualState(
  absorptionAge: number,
  absorptionDuration: number,
): AbsorptionVisualState {
  if (absorptionDuration <= 0) return { opacity: 0, scale: 0.55 }

  const progress = Math.min(1, Math.max(0, absorptionAge / absorptionDuration))
  const easedProgress = progress * progress * (3 - 2 * progress)
  return {
    opacity: 1 - easedProgress,
    scale: 1 - easedProgress * 0.45,
  }
}

export function aimAt(start: Point, target: Point, speed: number): VelocityVector {
  const dx = target.x - start.x
  const dy = target.y - start.y
  const distance = Math.hypot(dx, dy) || 1
  return {
    vx: dx / distance * speed,
    vy: dy / distance * speed,
  }
}

export function resolveRigidCollision(
  first: MotionBody,
  second: MotionBody,
  restitution = 0.72,
): boolean {
  let dx = second.x - first.x
  let dy = second.y - first.y
  let distance = Math.hypot(dx, dy)
  const minimumDistance = first.radius + second.radius

  if (distance >= minimumDistance) return false
  if (distance < 0.0001) {
    dx = 1
    dy = 0
    distance = 1
  }

  const nx = dx / distance
  const ny = dy / distance
  const inverseFirstMass = 1 / first.mass
  const inverseSecondMass = 1 / second.mass
  const inverseMassTotal = inverseFirstMass + inverseSecondMass
  const overlap = minimumDistance - distance

  first.x -= nx * overlap * inverseFirstMass / inverseMassTotal
  first.y -= ny * overlap * inverseFirstMass / inverseMassTotal
  second.x += nx * overlap * inverseSecondMass / inverseMassTotal
  second.y += ny * overlap * inverseSecondMass / inverseMassTotal

  const relativeNormalVelocity = (second.vx - first.vx) * nx + (second.vy - first.vy) * ny
  if (relativeNormalVelocity >= 0) return true

  const impulse = -(1 + restitution) * relativeNormalVelocity / inverseMassTotal
  first.vx -= impulse * nx * inverseFirstMass
  first.vy -= impulse * ny * inverseFirstMass
  second.vx += impulse * nx * inverseSecondMass
  second.vy += impulse * ny * inverseSecondMass
  return true
}

export function resolveRigidCollisions(
  bodies: MotionBody[],
  iterations = 8,
  restitution = 0.72,
): number {
  const solverIterations = Math.max(1, Math.floor(iterations))
  let resolvedContacts = 0

  for (let iteration = 0; iteration < solverIterations; iteration += 1) {
    let contactsThisIteration = 0

    for (let firstIndex = 0; firstIndex < bodies.length; firstIndex += 1) {
      const first = bodies[firstIndex]
      if (!first) continue

      for (let secondIndex = firstIndex + 1; secondIndex < bodies.length; secondIndex += 1) {
        const second = bodies[secondIndex]
        if (!second) continue
        if (!resolveRigidCollision(first, second, restitution)) continue

        contactsThisIteration += 1
        resolvedContacts += 1
      }
    }

    if (contactsThisIteration === 0) break
  }

  return resolvedContacts
}
