<script setup lang="ts">
import {
  aimAt,
  calculateCentralForce,
  calculateCoulombRepulsion,
  calculateMeanFieldRestoringAcceleration,
  isBodyOutsideViewport,
  isProjectileAbsorbed,
  resolveRigidCollisions,
  type MotionBody,
} from '~~/shared/utils/nucleus-simulation'

type NucleonType = 'proton' | 'neutron'
type ParticlePhase = 'bound' | 'incoming' | 'emitted'

interface TrailPoint {
  x: number
  y: number
  time: number
}

interface SimulationParticle extends MotionBody {
  id: number
  type: NucleonType
  phase: ParticlePhase
  hasImpacted: boolean
  timeSinceImpact: number
  trail: TrailPoint[] | null
}

interface NucleusPulse {
  x: number
  y: number
  struckParticleId: number | null
  age: number
  duration: number
  energy: number
}

type TemporaryAbsorption =
  | { stage: 'held', type: NucleonType, releaseTime: number }
  | { stage: 'released', retryTime: number }

const canvas = ref<HTMLCanvasElement | null>(null)
const props = withDefaults(defineProps<{ paused?: boolean }>(), { paused: false })

let context: CanvasRenderingContext2D | null = null
let animationFrame: number | undefined
let resizeObserver: ResizeObserver | undefined
let intersectionObserver: IntersectionObserver | undefined
let reducedMotionQuery: MediaQueryList | undefined
let particles: SimulationParticle[] = []
let pulses: NucleusPulse[] = []
let temporaryAbsorption: TemporaryAbsorption | null = null
let simulationTime = 0
let width = 0
let height = 0
let nucleusX = 0
let nucleusY = 0
let nucleusRadius = 0
let particleRadius = 9
let clusterRadius = 0
let nextParticleId = 0
let nextProjectileIn = 1.25
let lastTimestamp = 0
let isVisible = true
let prefersReducedMotion = false
const maximumActiveProjectiles = 3
const trailDuration = 0.42
const trailDotInterval = 0.065
const shortRangeRadiusMultiplier = 5.4
const fieldRingPeriod = 3.4
const fieldRingCount = 2
const excitationDuration = 0.44
const clusterStretchTolerance = 0.12
const clusterShapeStrength = 4

function randomBetween(minimum: number, maximum: number): number {
  return minimum + Math.random() * (maximum - minimum)
}

function configureGeometry(): void {
  const isNarrow = width < 720
  nucleusX = width * (isNarrow ? 0.8 : 0.75)
  nucleusY = height * (isNarrow ? 0.44 : 0.43)
  nucleusRadius = Math.min(
    isNarrow ? width * 0.34 : width * 0.145,
    height * (isNarrow ? 0.17 : 0.3),
    isNarrow ? 125 : 170,
  )
  nucleusRadius = Math.max(isNarrow ? 92 : 118, nucleusRadius)
  particleRadius = Math.max(6.5, Math.min(10.5, nucleusRadius / 14.5))
}

function measureClusterRadius(): number {
  let radius = 0
  for (const particle of particles) {
    if (particle.phase !== 'bound') continue
    radius = Math.max(radius, Math.hypot(particle.x - nucleusX, particle.y - nucleusY))
  }
  return radius
}

function measureClusterStretch() {
  let count = 0
  let sumX = 0
  let sumY = 0
  let sumXX = 0
  let sumYY = 0
  let sumXY = 0
  for (const particle of particles) {
    if (particle.phase !== 'bound') continue
    const x = particle.x - nucleusX
    const y = particle.y - nucleusY
    count += 1
    sumX += x
    sumY += y
    sumXX += x * x
    sumYY += y * y
    sumXY += x * y
  }
  if (count < 2) return null

  const centreX = sumX / count
  const centreY = sumY / count
  const spreadX = sumXX / count - centreX * centreX
  const spreadY = sumYY / count - centreY * centreY
  const totalSpread = spreadX + spreadY
  if (totalSpread <= 0) return null

  // The covariance captures elongation in any direction, including diagonally.
  const diagonal = (spreadX - spreadY) / totalSpread
  const cross = 2 * (sumXY / count - centreX * centreY) / totalSpread
  const stretch = Math.hypot(diagonal, cross)
  if (stretch <= clusterStretchTolerance) return null

  const strength = clusterShapeStrength * (1 - clusterStretchTolerance / stretch)
  return { centreX, centreY, diagonal: diagonal * strength, cross: cross * strength }
}

function seedNucleus(): void {
  particles = []
  pulses = []
  temporaryAbsorption = null
  simulationTime = 0
  nextParticleId = 0
  const count = width < 720 ? 20 : 28
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))

  for (let index = 0; index < count; index += 1) {
    const radialFraction = Math.sqrt((index + 0.45) / count) * 0.72
    const angle = index * goldenAngle
    particles.push({
      id: nextParticleId,
      type: index % 2 === 0 ? 'proton' : 'neutron',
      x: nucleusX + Math.cos(angle) * nucleusRadius * radialFraction + randomBetween(-2.5, 2.5),
      y: nucleusY + Math.sin(angle) * nucleusRadius * radialFraction + randomBetween(-2.5, 2.5),
      vx: randomBetween(-3, 3),
      vy: randomBetween(-3, 3),
      radius: particleRadius,
      mass: 1,
      phase: 'bound',
      hasImpacted: false,
      timeSinceImpact: 0,
      trail: null,
    })
    nextParticleId += 1
  }
  resolveRigidCollisions(particles, 24, 0.35)
  clusterRadius = measureClusterRadius()
  nextProjectileIn = prefersReducedMotion ? Number.POSITIVE_INFINITY : 0.85
}

function spawnProjectile(): void {
  // A particle held by the nucleus still occupies a slot until emission.
  const activeProjectiles = particles.filter(particle => particle.phase !== 'bound').length
    + Number(temporaryAbsorption?.stage === 'held')
  if (activeProjectiles >= maximumActiveProjectiles) {
    nextProjectileIn = 0.65
    return
  }

  const impactParameter = randomBetween(-nucleusRadius * 0.72, nucleusRadius * 0.72)
  const start = {
    x: -particleRadius * 4,
    y: nucleusY + impactParameter + randomBetween(-height * 0.05, height * 0.05),
  }
  const target = {
    x: nucleusX + randomBetween(-nucleusRadius * 0.18, nucleusRadius * 0.18),
    y: nucleusY + impactParameter,
  }
  const speed = randomBetween(width < 720 ? 175 : 225, width < 720 ? 255 : 345)
  const velocity = aimAt(start, target, speed)

  particles.push({
    id: nextParticleId,
    type: Math.random() > 0.5 ? 'proton' : 'neutron',
    x: start.x,
    y: start.y,
    vx: velocity.vx,
    vy: velocity.vy,
    radius: particleRadius * 0.78,
    mass: 0.9,
    phase: 'incoming',
    hasImpacted: false,
    timeSinceImpact: 0,
    trail: [{ ...start, time: simulationTime }],
  })
  nextParticleId += 1
  nextProjectileIn = randomBetween(width < 720 ? 1.8 : 1.25, width < 720 ? 3 : 2.35)
}

function registerImpact(projectile: SimulationParticle, struckParticle: SimulationParticle): void {
  if (projectile.hasImpacted) return
  projectile.hasImpacted = true
  projectile.timeSinceImpact = 0
  const speed = Math.hypot(projectile.vx, projectile.vy)
  const energy = Math.min(1, speed / 340)
  pulses.push({
    x: struckParticle.x,
    y: struckParticle.y,
    struckParticleId: struckParticle.id,
    age: 0,
    duration: 0.52,
    energy,
  })

  for (const particle of particles) {
    if (particle.phase !== 'bound') continue
    const dx = particle.x - struckParticle.x
    const dy = particle.y - struckParticle.y
    const distance = Math.hypot(dx, dy) || 1
    const reach = Math.max(0, 1 - distance / (nucleusRadius * 1.35))
    particle.vx += dx / distance * speed * 0.055 * reach
    particle.vy += dy / distance * speed * 0.055 * reach
  }
}

function resolveParticleContacts(): void {
  for (const projectile of particles) {
    if (projectile.phase !== 'incoming' || projectile.hasImpacted) continue

    for (const target of particles) {
      if (target.phase !== 'bound') continue
      const separation = Math.hypot(target.x - projectile.x, target.y - projectile.y)
      if (separation >= target.radius + projectile.radius) continue

      registerImpact(projectile, target)
      break
    }
  }

  // Several passes are needed because separating one contact can compress a
  // neighbouring pair in a dense cluster. The final pass happens immediately
  // before drawing, so the visible discs never retain an overlap for a frame.
  resolveRigidCollisions(particles, 16)
}

function holdProjectile(particle: SimulationParticle): void {
  const duration = randomBetween(0.9, 1.3)
  temporaryAbsorption = { stage: 'held', type: particle.type, releaseTime: simulationTime + duration }
  particle.phase = 'bound'
  particle.vx *= 0.35
  particle.vy *= 0.35
  particle.radius = particleRadius
  particle.mass = 1
  resolveRigidCollisions(particles, 16)
  pulses.push({
    x: particle.x,
    y: particle.y,
    struckParticleId: null,
    age: 0,
    duration,
    energy: 0.62,
  })
}

function launchEjectedParticle(particle: SimulationParticle, vx: number, vy: number): void {
  particle.phase = 'emitted'
  particle.hasImpacted = true
  particle.timeSinceImpact = 0
  particle.vx = vx
  particle.vy = vy
  // Cap the time an interrupted ejection can keep the nucleus waiting.
  const crossingTime = Math.hypot(width, height) / Math.hypot(vx, vy)
  temporaryAbsorption = { stage: 'released', retryTime: simulationTime + crossingTime * 1.6 + 1 }
}

function releaseNucleon(type: NucleonType): void {
  // Aim towards the open part of the canvas and emit from that side of the cluster.
  const angle = Math.PI + randomBetween(-1.1, 1.1)
  const directionX = Math.cos(angle)
  const directionY = Math.sin(angle)
  let outgoing: SimulationParticle | undefined
  let furthestProjection = Number.NEGATIVE_INFINITY
  for (const particle of particles) {
    if (particle.phase !== 'bound' || particle.type !== type) continue
    const projection = particle.x * directionX + particle.y * directionY
    if (projection <= furthestProjection) continue
    outgoing = particle
    furthestProjection = projection
  }
  if (!outgoing) return

  const speed = randomBetween(285, 400)
  outgoing.trail = [{ x: outgoing.x, y: outgoing.y, time: simulationTime }]
  launchEjectedParticle(outgoing, directionX * speed, directionY * speed)
}

function excitationProgressAt(time: number): number {
  if (temporaryAbsorption?.stage !== 'held') return 0

  const progress = 1 - (temporaryAbsorption.releaseTime - time) / excitationDuration
  return progress > 0 && progress < 1 ? progress : 0
}

function excitationStrength(progress: number): number {
  return Math.sin(Math.PI * progress) ** 2
}

function excitationAngleAt(time: number): number {
  const progress = excitationProgressAt(time)
  return 0.065 * excitationStrength(progress) * Math.sin(6 * Math.PI * progress)
}

function updateSimulation(deltaTime: number): void {
  simulationTime += deltaTime
  resolveParticleContacts()
  const clusterStretch = measureClusterStretch()
  const acceleration = particles.map(() => ({ x: 0, y: 0 }))
  const interactionRange = particleRadius * shortRangeRadiusMultiplier
  const coreRadius = particleRadius * 2.05
  const coulombSofteningRadius = particleRadius * 1.25
  const coulombStrength = particleRadius * particleRadius * 115

  for (let firstIndex = 0; firstIndex < particles.length; firstIndex += 1) {
    const first = particles[firstIndex]
    const firstAcceleration = acceleration[firstIndex]
    if (!first || !firstAcceleration) continue

    for (let secondIndex = firstIndex + 1; secondIndex < particles.length; secondIndex += 1) {
      const second = particles[secondIndex]
      const secondAcceleration = acceleration[secondIndex]
      if (!second || !secondAcceleration) continue

      const dx = second.x - first.x
      const dy = second.y - first.y
      const distance = Math.hypot(dx, dy) || 0.0001
      let force = 0
      if (distance < interactionRange) {
        force += calculateCentralForce(distance, coreRadius, interactionRange)
      }
      if (first.type === 'proton' && second.type === 'proton') {
        force += calculateCoulombRepulsion(distance, coulombSofteningRadius, coulombStrength)
      }
      if (force === 0) continue

      const nx = dx / distance
      const ny = dy / distance
      firstAcceleration.x += nx * force / first.mass
      firstAcceleration.y += ny * force / first.mass
      secondAcceleration.x -= nx * force / second.mass
      secondAcceleration.y -= ny * force / second.mass
    }
  }

  for (let index = 0; index < particles.length; index += 1) {
    const particle = particles[index]
    const particleAcceleration = acceleration[index]
    if (!particle || !particleAcceleration) continue

    if (particle.phase !== 'bound' && particle.hasImpacted) particle.timeSinceImpact += deltaTime
    if (particle.phase === 'bound') {
      const dx = particle.x - nucleusX
      const dy = particle.y - nucleusY
      const distance = Math.hypot(dx, dy) || 1
      const edge = nucleusRadius - particle.radius
      if (distance > edge) {
        const wallCompression = distance - edge
        particleAcceleration.x -= dx / distance * wallCompression * 28
        particleAcceleration.y -= dy / distance * wallCompression * 28
      }

      const meanFieldAcceleration = calculateMeanFieldRestoringAcceleration(distance, edge)
      particleAcceleration.x -= dx / distance * meanFieldAcceleration
      particleAcceleration.y -= dy / distance * meanFieldAcceleration

      // Gently compress the long axis and open the short axis of the cluster.
      if (clusterStretch) {
        const x = dx - clusterStretch.centreX
        const y = dy - clusterStretch.centreY
        particleAcceleration.x -= clusterStretch.diagonal * x + clusterStretch.cross * y
        particleAcceleration.y -= clusterStretch.cross * x - clusterStretch.diagonal * y
      }

      particleAcceleration.x += randomBetween(-18, 18)
      particleAcceleration.y += randomBetween(-18, 18)
    }

    particle.vx += particleAcceleration.x * deltaTime
    particle.vy += particleAcceleration.y * deltaTime
    const damping = Math.pow(particle.phase === 'bound' ? 0.986 : 0.999, deltaTime * 60)
    particle.vx *= damping
    particle.vy *= damping
    particle.x += particle.vx * deltaTime
    particle.y += particle.vy * deltaTime
  }

  resolveParticleContacts()

  const nucleusCentre = { x: nucleusX, y: nucleusY }
  const captureRadius = nucleusRadius * 0.82
  const escapeRadius = Math.max(captureRadius, clusterRadius + interactionRange) + 2 * particleRadius
  particles = particles.filter((particle) => {
    const trail = particle.trail
    if (!trail) return true
    while (trail[0] && simulationTime - trail[0].time >= trailDuration) trail.shift()
    if (particle.phase === 'bound') {
      if (trail.length === 0) particle.trail = null
      return true
    }
    trail.push({ x: particle.x, y: particle.y, time: simulationTime })

    const canSettle = temporaryAbsorption === null || particle.phase === 'emitted'
    if (canSettle && isProjectileAbsorbed(particle, nucleusCentre, captureRadius, particleRadius * 5.5, 0.65)) {
      holdProjectile(particle)
      return true
    }

    // Keep the particle until both the disc and its trail clear the canvas.
    const onScreen = !isBodyOutsideViewport(particle, width, height, 90)
      || trail.some(point => point.x >= -3 && point.x <= width + 3 && point.y >= -3 && point.y <= height + 3)
    if (particle.phase === 'emitted') {
      const dx = particle.x - nucleusX
      const dy = particle.y - nucleusY
      const distance = Math.hypot(dx, dy)
      const movingOutward = dx * particle.vx + dy * particle.vy > 0
      if (!onScreen || (distance - particle.radius >= escapeRadius && movingOutward)) {
        temporaryAbsorption = null
        // Keep its existing trail. A later return requires a new impact.
        particle.phase = 'incoming'
        particle.hasImpacted = false
        particle.timeSinceImpact = 0
      } else if (temporaryAbsorption?.stage === 'released' && simulationTime >= temporaryAbsorption.retryTime) {
        if (distance <= captureRadius) {
          holdProjectile(particle)
        } else {
          // The particle is already outside the cluster. Resume its exit from
          // its current position without creating or removing a nucleon.
          const velocity = aimAt(nucleusCentre, particle, 345)
          launchEjectedParticle(particle, velocity.vx, velocity.vy)
        }
      }
    }
    return onScreen
  })

  if (temporaryAbsorption?.stage === 'held' && simulationTime >= temporaryAbsorption.releaseTime) {
    releaseNucleon(temporaryAbsorption.type)
  }

  nextProjectileIn -= deltaTime
  if (nextProjectileIn <= 0) spawnProjectile()

  for (const pulse of pulses) pulse.age += deltaTime
  pulses = pulses.filter(pulse => pulse.age < pulse.duration)

  const radiusBlend = 1 - Math.exp(-deltaTime * 3)
  clusterRadius += (measureClusterRadius() - clusterRadius) * radiusBlend

  if (particles.some(particle => !Number.isFinite(particle.x) || !Number.isFinite(particle.y))) {
    seedNucleus()
  }
}

function drawConfinement(activeContext: CanvasRenderingContext2D): void {
  const excitation = excitationStrength(excitationProgressAt(simulationTime))
  const glow = activeContext.createRadialGradient(
    nucleusX,
    nucleusY,
    nucleusRadius * 0.1,
    nucleusX,
    nucleusY,
    nucleusRadius * 1.2,
  )
  glow.addColorStop(0, 'rgba(97, 164, 198, 0.07)')
  glow.addColorStop(0.72, `rgba(200, 155, 60, ${0.055 + 0.18 * excitation})`)
  glow.addColorStop(1, 'rgba(6, 26, 44, 0)')
  activeContext.fillStyle = glow
  activeContext.beginPath()
  activeContext.arc(nucleusX, nucleusY, nucleusRadius * 1.2, 0, Math.PI * 2)
  activeContext.fill()

  activeContext.strokeStyle = `rgba(230, 200, 121, ${0.38 + 0.32 * excitation})`
  activeContext.lineWidth = 1
  activeContext.setLineDash([3, 8])
  activeContext.beginPath()
  activeContext.arc(nucleusX, nucleusY, nucleusRadius, 0, Math.PI * 2)
  activeContext.stroke()
  activeContext.setLineDash([])
}

function drawFieldRings(activeContext: CanvasRenderingContext2D): void {
  const interactionRange = particleRadius * shortRangeRadiusMultiplier
  const innerRadius = clusterRadius + particleRadius
  const outerRadius = clusterRadius + interactionRange
  activeContext.save()
  activeContext.strokeStyle = '#a6ddf2'
  activeContext.lineWidth = 1.3

  for (let index = 0; index < fieldRingCount; index += 1) {
    const progress = (simulationTime / fieldRingPeriod + index / fieldRingCount) % 1
    const radius = outerRadius + (innerRadius - outerRadius) * progress
    // These rings trace the reach of the short-range interaction. Their motion
    // is illustrative, and the Coulomb term still acts beyond this region.
    activeContext.globalAlpha = Math.sin(Math.PI * progress) * (0.18 + progress * 0.24)
    activeContext.beginPath()
    activeContext.arc(nucleusX, nucleusY, radius, 0, Math.PI * 2)
    activeContext.stroke()
  }
  activeContext.restore()
}

function drawBonds(activeContext: CanvasRenderingContext2D): void {
  const boundParticles = particles.filter(particle => particle.phase === 'bound')
  const bondRange = particleRadius * 3.2
  for (let firstIndex = 0; firstIndex < boundParticles.length; firstIndex += 1) {
    const first = boundParticles[firstIndex]
    if (!first) continue
    for (let secondIndex = firstIndex + 1; secondIndex < boundParticles.length; secondIndex += 1) {
      const second = boundParticles[secondIndex]
      if (!second) continue
      const distance = Math.hypot(second.x - first.x, second.y - first.y)
      if (distance >= bondRange) continue
      const alpha = (1 - distance / bondRange) * 0.1
      activeContext.strokeStyle = `rgba(205, 225, 236, ${alpha})`
      activeContext.lineWidth = 0.75
      activeContext.beginPath()
      activeContext.moveTo(first.x, first.y)
      activeContext.lineTo(second.x, second.y)
      activeContext.stroke()
    }
  }
}

function drawProjectileTrail(activeContext: CanvasRenderingContext2D, particle: SimulationParticle): void {
  const trail = particle.trail
  if (!trail || trail.length < 2) return

  activeContext.save()
  activeContext.fillStyle = particle.type === 'proton' ? '#ffebad' : '#a6ddf2'
  let sampleIndex = trail.length - 1
  const firstTime = trail[0]!.time
  const lastDot = Math.floor(trail[sampleIndex]!.time / trailDotInterval)
  for (let dot = lastDot; dot * trailDotInterval >= firstTime; dot -= 1) {
    const dotTime = dot * trailDotInterval
    // Render at fixed simulation times, independent of the display refresh rate.
    while (sampleIndex > 1 && trail[sampleIndex - 1]!.time > dotTime) sampleIndex -= 1
    const previous = trail[sampleIndex - 1]!
    const sample = trail[sampleIndex]!
    if (sample.time === previous.time) continue

    const fraction = (dotTime - previous.time) / (sample.time - previous.time)
    const x = previous.x + (sample.x - previous.x) * fraction
    const y = previous.y + (sample.y - previous.y) * fraction
    const remaining = 1 - (simulationTime - dotTime) / trailDuration
    activeContext.globalAlpha = 0.82 * remaining ** 1.3
    activeContext.beginPath()
    activeContext.arc(x, y, 1.65, 0, Math.PI * 2)
    activeContext.fill()
  }
  activeContext.restore()
}

function drawNucleonPulse(activeContext: CanvasRenderingContext2D, particle: SimulationParticle): void {
  for (const pulse of pulses) {
    const isContact = pulse.struckParticleId !== null
    const wasStruck = pulse.struckParticleId === particle.id
    const distance = wasStruck ? 0 : Math.hypot(particle.x - pulse.x, particle.y - pulse.y)
    const reach = particleRadius * (isContact ? 6 : 4)
    if (distance >= reach) continue

    // Delay the glow by distance so the disturbance reads as spreading from the hit.
    const localAge = pulse.age - distance / (particleRadius * 24)
    const duration = isContact ? 0.25 : pulse.duration * 0.8
    if (localAge < 0 || localAge >= duration) continue

    const progress = localAge / duration
    const envelope = isContact ? (1 - progress) ** 2 : Math.sin(Math.PI * progress)
    const strength = pulse.energy * envelope * (1 - distance / reach) * (wasStruck ? 1 : 0.7)
    const colour = isContact ? '255, 235, 173' : '156, 214, 239'
    activeContext.strokeStyle = `rgba(${colour}, ${strength})`
    activeContext.lineWidth = wasStruck ? 2 : 1.1
    activeContext.beginPath()
    activeContext.arc(particle.x, particle.y, particle.radius + 2 + 2 * progress, 0, Math.PI * 2)
    activeContext.stroke()
  }
}

function drawParticle(activeContext: CanvasRenderingContext2D, particle: SimulationParticle): void {
  const colour = particle.type === 'proton' ? '#f0c75e' : '#79c7e6'
  activeContext.save()

  activeContext.shadowColor = colour
  activeContext.shadowBlur = particle.phase === 'bound' ? 2.5 : 9
  activeContext.fillStyle = colour
  activeContext.globalAlpha = particle.phase === 'bound' ? 0.98 : 1
  activeContext.beginPath()
  activeContext.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
  activeContext.fill()
  activeContext.shadowBlur = 0
  activeContext.globalAlpha = 1

  activeContext.strokeStyle = 'rgba(4, 22, 38, 0.82)'
  activeContext.lineWidth = 1.35
  activeContext.beginPath()
  activeContext.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
  activeContext.stroke()

  activeContext.fillStyle = 'rgba(255, 255, 255, 0.46)'
  activeContext.beginPath()
  activeContext.arc(
    particle.x - particle.radius * 0.24,
    particle.y - particle.radius * 0.24,
    particle.radius * 0.2,
    0,
    Math.PI * 2,
  )
  activeContext.fill()
  activeContext.restore()
}

function drawSimulation(): void {
  if (!context) return
  context.clearRect(0, 0, width, height)
  drawConfinement(context)
  drawFieldRings(context)
  for (const particle of particles) drawProjectileTrail(context, particle)

  const angle = excitationAngleAt(simulationTime)
  context.save()
  if (angle !== 0) {
    // Keep the vibration in the drawing so it cannot change collisions or ejection.
    context.translate(nucleusX, nucleusY)
    context.rotate(angle)
    context.translate(-nucleusX, -nucleusY)
  }
  drawBonds(context)
  for (const particle of particles) {
    if (particle.phase === 'bound') drawNucleonPulse(context, particle)
  }
  for (const particle of particles) {
    if (particle.phase === 'bound') drawParticle(context, particle)
  }
  context.restore()

  for (const particle of particles) {
    if (particle.phase !== 'bound') drawParticle(context, particle)
  }
}

function runFrame(timestamp: number): void {
  if (!isVisible || prefersReducedMotion || props.paused || document.hidden) {
    animationFrame = undefined
    return
  }
  const deltaTime = lastTimestamp === 0 ? 1 / 60 : Math.min((timestamp - lastTimestamp) / 1000, 0.025)
  lastTimestamp = timestamp
  updateSimulation(deltaTime)
  drawSimulation()
  animationFrame = requestAnimationFrame(runFrame)
}

function startAnimation(): void {
  if (animationFrame !== undefined || !isVisible || prefersReducedMotion || props.paused || document.hidden) return
  lastTimestamp = 0
  animationFrame = requestAnimationFrame(runFrame)
}

function stopAnimation(): void {
  if (animationFrame === undefined) return
  cancelAnimationFrame(animationFrame)
  animationFrame = undefined
}

function resizeCanvas(): void {
  const activeCanvas = canvas.value
  if (!activeCanvas) return
  const bounds = activeCanvas.getBoundingClientRect()
  if (bounds.width <= 0 || bounds.height <= 0) return

  width = bounds.width
  height = bounds.height
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)
  activeCanvas.width = Math.round(width * pixelRatio)
  activeCanvas.height = Math.round(height * pixelRatio)
  context = activeCanvas.getContext('2d')
  context?.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  configureGeometry()
  seedNucleus()
  drawSimulation()
  startAnimation()
}

function handleReducedMotionChange(event: MediaQueryListEvent): void {
  prefersReducedMotion = event.matches
  if (prefersReducedMotion) {
    stopAnimation()
    seedNucleus()
    drawSimulation()
  } else {
    nextProjectileIn = 1.25
    startAnimation()
  }
}

function handleVisibilityChange(): void {
  if (document.hidden) stopAnimation()
  else startAnimation()
}

watch(() => props.paused, (paused) => {
  if (paused) stopAnimation()
  else startAnimation()
})

onMounted(() => {
  const activeCanvas = canvas.value
  if (!activeCanvas) return

  reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion = reducedMotionQuery.matches
  reducedMotionQuery.addEventListener('change', handleReducedMotionChange)

  resizeObserver = new ResizeObserver(resizeCanvas)
  resizeObserver.observe(activeCanvas)

  intersectionObserver = new IntersectionObserver(([entry]) => {
    isVisible = entry?.isIntersecting ?? true
    if (isVisible) startAnimation()
    else stopAnimation()
  }, { threshold: 0.02 })
  intersectionObserver.observe(activeCanvas)
  document.addEventListener('visibilitychange', handleVisibilityChange)
  resizeCanvas()
})

onBeforeUnmount(() => {
  stopAnimation()
  resizeObserver?.disconnect()
  intersectionObserver?.disconnect()
  reducedMotionQuery?.removeEventListener('change', handleReducedMotionChange)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <div class="hero-simulation" aria-hidden="true">
    <canvas ref="canvas" />
  </div>
</template>
