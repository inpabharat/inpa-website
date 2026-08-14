<script setup lang="ts">
import {
  aimAt,
  calculateAbsorptionVisualState,
  calculateCentralForce,
  calculateCoulombRepulsion,
  calculateMeanFieldRestoringAcceleration,
  isBodyOutsideViewport,
  isProjectileAbsorbed,
  resolveRigidCollisions,
  type MotionBody,
} from '~~/shared/utils/nucleus-simulation'

type NucleonType = 'proton' | 'neutron'

interface SimulationParticle extends MotionBody {
  id: number
  type: NucleonType
  isProjectile: boolean
  hasImpacted: boolean
  timeSinceImpact: number
  absorptionAge: number | null
  absorptionDuration: number
}

interface ImpactRipple {
  x: number
  y: number
  age: number
  duration: number
  energy: number
}

const canvas = ref<HTMLCanvasElement | null>(null)

let context: CanvasRenderingContext2D | null = null
let animationFrame: number | undefined
let resizeObserver: ResizeObserver | undefined
let intersectionObserver: IntersectionObserver | undefined
let reducedMotionQuery: MediaQueryList | undefined
let particles: SimulationParticle[] = []
let ripples: ImpactRipple[] = []
let width = 0
let height = 0
let nucleusX = 0
let nucleusY = 0
let nucleusRadius = 0
let particleRadius = 9
let nextParticleId = 0
let nextProjectileIn = 1.25
let lastTimestamp = 0
let isVisible = true
let prefersReducedMotion = false
const maximumActiveProjectiles = 3

function randomBetween(minimum: number, maximum: number): number {
  return minimum + Math.random() * (maximum - minimum)
}

function configureGeometry(): void {
  const isNarrow = width < 720
  nucleusX = width * (isNarrow ? 0.6 : 0.56)
  nucleusY = height * (isNarrow ? 0.68 : 0.49)
  nucleusRadius = Math.min(
    isNarrow ? width * 0.34 : width * 0.145,
    height * (isNarrow ? 0.17 : 0.3),
    isNarrow ? 125 : 170,
  )
  nucleusRadius = Math.max(isNarrow ? 92 : 118, nucleusRadius)
  particleRadius = Math.max(6.5, Math.min(10.5, nucleusRadius / 14.5))
}

function seedNucleus(): void {
  particles = []
  ripples = []
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
      isProjectile: false,
      hasImpacted: false,
      timeSinceImpact: 0,
      absorptionAge: null,
      absorptionDuration: 0,
    })
    nextParticleId += 1
  }
  resolveRigidCollisions(particles, 24, 0.35)
  nextProjectileIn = prefersReducedMotion ? Number.POSITIVE_INFINITY : 0.85
}

function spawnProjectile(): void {
  const activeProjectiles = particles.filter(
    particle => particle.isProjectile && particle.absorptionAge === null,
  ).length
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
    isProjectile: true,
    hasImpacted: false,
    timeSinceImpact: 0,
    absorptionAge: null,
    absorptionDuration: 0,
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
  ripples.push({
    x: struckParticle.x,
    y: struckParticle.y,
    age: 0,
    duration: 1.1,
    energy,
  })

  for (const particle of particles) {
    if (particle.isProjectile) continue
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
    if (!projectile.isProjectile || projectile.hasImpacted || projectile.absorptionAge !== null) continue

    for (const target of particles) {
      if (target.isProjectile) continue
      const separation = Math.hypot(target.x - projectile.x, target.y - projectile.y)
      if (separation >= target.radius + projectile.radius) continue

      registerImpact(projectile, target)
      break
    }
  }

  // Several passes are needed because separating one contact can compress a
  // neighbouring pair in a dense cluster. The final pass happens immediately
  // before drawing, so the visible discs never retain an overlap for a frame.
  resolveRigidCollisions(
    particles.filter(particle => particle.absorptionAge === null),
    16,
  )
}

function updateSimulation(deltaTime: number): void {
  resolveParticleContacts()
  const acceleration = particles.map(() => ({ x: 0, y: 0 }))
  const interactionRange = particleRadius * 5.4
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
      if (first.absorptionAge !== null || second.absorptionAge !== null) continue

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

    if (particle.absorptionAge !== null) {
      particle.absorptionAge += deltaTime
      const settlingDamping = Math.pow(0.9, deltaTime * 60)
      particle.vx *= settlingDamping
      particle.vy *= settlingDamping
      particle.x += particle.vx * deltaTime + (nucleusX - particle.x) * deltaTime * 0.28
      particle.y += particle.vy * deltaTime + (nucleusY - particle.y) * deltaTime * 0.28
      continue
    }

    if (particle.hasImpacted) particle.timeSinceImpact += deltaTime
    if (!particle.isProjectile) {
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
      particleAcceleration.x += randomBetween(-18, 18)
      particleAcceleration.y += randomBetween(-18, 18)
    }

    particle.vx += particleAcceleration.x * deltaTime
    particle.vy += particleAcceleration.y * deltaTime
    const damping = Math.pow(particle.isProjectile ? 0.999 : 0.986, deltaTime * 60)
    particle.vx *= damping
    particle.vy *= damping
    particle.x += particle.vx * deltaTime
    particle.y += particle.vy * deltaTime
  }

  resolveParticleContacts()

  particles = particles.filter((particle) => {
    if (!particle.isProjectile) return true
    if (particle.absorptionAge !== null) {
      return particle.absorptionAge < particle.absorptionDuration
    }

    const absorbed = isProjectileAbsorbed(
      particle,
      { x: nucleusX, y: nucleusY },
      nucleusRadius * 0.82,
      particleRadius * 5.5,
      0.65,
    )
    if (absorbed) {
      particle.absorptionAge = 0
      particle.absorptionDuration = randomBetween(1.05, 1.55)
      particle.vx *= 0.35
      particle.vy *= 0.35
      ripples.push({
        x: particle.x,
        y: particle.y,
        age: 0,
        duration: particle.absorptionDuration,
        energy: 0.28,
      })
      return true
    }

    // A scattered projectile has no arbitrary age limit. Keep it alive until
    // the full disc and its visual trail have cleared whichever edge it exits.
    if (isBodyOutsideViewport(particle, width, height, 90)) return false
    return true
  })

  nextProjectileIn -= deltaTime
  if (nextProjectileIn <= 0) spawnProjectile()

  ripples = ripples
    .map(ripple => ({ ...ripple, age: ripple.age + deltaTime }))
    .filter(ripple => ripple.age < ripple.duration)

  if (particles.some(particle => !Number.isFinite(particle.x) || !Number.isFinite(particle.y))) {
    seedNucleus()
  }
}

function drawConfinement(activeContext: CanvasRenderingContext2D): void {
  const glow = activeContext.createRadialGradient(
    nucleusX,
    nucleusY,
    nucleusRadius * 0.1,
    nucleusX,
    nucleusY,
    nucleusRadius * 1.2,
  )
  glow.addColorStop(0, 'rgba(97, 164, 198, 0.07)')
  glow.addColorStop(0.72, 'rgba(200, 155, 60, 0.055)')
  glow.addColorStop(1, 'rgba(6, 26, 44, 0)')
  activeContext.fillStyle = glow
  activeContext.beginPath()
  activeContext.arc(nucleusX, nucleusY, nucleusRadius * 1.2, 0, Math.PI * 2)
  activeContext.fill()

  activeContext.strokeStyle = 'rgba(230, 200, 121, 0.38)'
  activeContext.lineWidth = 1
  activeContext.setLineDash([3, 8])
  activeContext.beginPath()
  activeContext.arc(nucleusX, nucleusY, nucleusRadius, 0, Math.PI * 2)
  activeContext.stroke()
  activeContext.setLineDash([])
}

function drawBonds(activeContext: CanvasRenderingContext2D): void {
  const boundParticles = particles.filter(particle => !particle.isProjectile)
  for (let firstIndex = 0; firstIndex < boundParticles.length; firstIndex += 1) {
    const first = boundParticles[firstIndex]
    if (!first) continue
    for (let secondIndex = firstIndex + 1; secondIndex < boundParticles.length; secondIndex += 1) {
      const second = boundParticles[secondIndex]
      if (!second) continue
      const distance = Math.hypot(second.x - first.x, second.y - first.y)
      const bondRange = particleRadius * 4.2
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

function drawParticle(activeContext: CanvasRenderingContext2D, particle: SimulationParticle): void {
  const colour = particle.type === 'proton' ? '#f0c75e' : '#79c7e6'
  const absorptionVisual = particle.absorptionAge === null
    ? { opacity: 1, scale: 1 }
    : calculateAbsorptionVisualState(particle.absorptionAge, particle.absorptionDuration)
  const displayRadius = particle.radius * absorptionVisual.scale

  activeContext.save()
  activeContext.globalAlpha = absorptionVisual.opacity

  if (particle.isProjectile && particle.absorptionAge === null) {
    const speed = Math.hypot(particle.vx, particle.vy) || 1
    const trailLength = Math.min(72, speed * 0.18)
    const gradient = activeContext.createLinearGradient(
      particle.x - particle.vx / speed * trailLength,
      particle.y - particle.vy / speed * trailLength,
      particle.x,
      particle.y,
    )
    gradient.addColorStop(0, 'rgba(230, 200, 121, 0)')
    gradient.addColorStop(1, 'rgba(255, 239, 190, 0.92)')
    activeContext.strokeStyle = gradient
    activeContext.lineWidth = 2
    activeContext.beginPath()
    activeContext.moveTo(
      particle.x - particle.vx / speed * trailLength,
      particle.y - particle.vy / speed * trailLength,
    )
    activeContext.lineTo(particle.x, particle.y)
    activeContext.stroke()
  }

  activeContext.shadowColor = colour
  activeContext.shadowBlur = particle.isProjectile ? 9 : 2.5
  activeContext.fillStyle = colour
  activeContext.globalAlpha = absorptionVisual.opacity * (particle.isProjectile ? 1 : 0.98)
  activeContext.beginPath()
  activeContext.arc(particle.x, particle.y, displayRadius, 0, Math.PI * 2)
  activeContext.fill()
  activeContext.shadowBlur = 0
  activeContext.globalAlpha = absorptionVisual.opacity

  activeContext.strokeStyle = 'rgba(4, 22, 38, 0.82)'
  activeContext.lineWidth = 1.35
  activeContext.beginPath()
  activeContext.arc(particle.x, particle.y, displayRadius, 0, Math.PI * 2)
  activeContext.stroke()

  activeContext.fillStyle = 'rgba(255, 255, 255, 0.46)'
  activeContext.beginPath()
  activeContext.arc(
    particle.x - displayRadius * 0.24,
    particle.y - displayRadius * 0.24,
    displayRadius * 0.2,
    0,
    Math.PI * 2,
  )
  activeContext.fill()
  activeContext.restore()
}

function drawRipples(activeContext: CanvasRenderingContext2D): void {
  for (const ripple of ripples) {
    const progress = ripple.age / ripple.duration
    activeContext.strokeStyle = `rgba(230, 200, 121, ${(1 - progress) * 0.55 * ripple.energy})`
    activeContext.lineWidth = 1.5
    activeContext.beginPath()
    activeContext.arc(ripple.x, ripple.y, particleRadius * 2 + nucleusRadius * 0.8 * progress, 0, Math.PI * 2)
    activeContext.stroke()
  }
}

function drawSimulation(): void {
  if (!context) return
  context.clearRect(0, 0, width, height)
  drawConfinement(context)
  drawBonds(context)
  drawRipples(context)
  for (const particle of particles) drawParticle(context, particle)
}

function runFrame(timestamp: number): void {
  if (!isVisible || prefersReducedMotion) {
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
  if (animationFrame !== undefined || !isVisible || prefersReducedMotion) return
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
