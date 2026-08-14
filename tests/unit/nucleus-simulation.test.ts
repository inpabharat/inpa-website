import { describe, expect, it } from 'vitest'
import {
  aimAt,
  calculateAbsorptionVisualState,
  calculateCentralForce,
  calculateCoulombRepulsion,
  calculateMeanFieldRestoringAcceleration,
  isBodyOutsideViewport,
  isProjectileAbsorbed,
  resolveRigidCollision,
  resolveRigidCollisions,
} from '../../shared/utils/nucleus-simulation'

describe('qualitative nucleus simulation helpers', () => {
  it('uses a repulsive core, attractive well and finite interaction range', () => {
    expect(calculateCentralForce(5, 20, 60)).toBeLessThan(0)
    expect(calculateCentralForce(38, 20, 60)).toBeGreaterThan(0)
    expect(calculateCentralForce(61, 20, 60)).toBe(0)
  })

  it('uses a softened long-range Coulomb repulsion', () => {
    const atContact = calculateCoulombRepulsion(20, 8, 10_000)
    const atLongRange = calculateCoulombRepulsion(100, 8, 10_000)

    expect(atContact).toBeLessThan(0)
    expect(atLongRange).toBeLessThan(0)
    expect(Math.abs(atContact)).toBeGreaterThan(Math.abs(atLongRange))
    expect(calculateCoulombRepulsion(0, 8, 10_000)).toBeTypeOf('number')
  })

  it('uses a weak interior and stronger surface mean field', () => {
    const atCentre = calculateMeanFieldRestoringAcceleration(0, 100)
    const inBulk = calculateMeanFieldRestoringAcceleration(40, 100)
    const nearSurface = calculateMeanFieldRestoringAcceleration(95, 100)

    expect(atCentre).toBe(0)
    expect(inBulk).toBeGreaterThan(0)
    expect(nearSurface).toBeGreaterThan(inBulk)
  })

  it('keeps a projectile alive until it is fully off screen', () => {
    const visibleProjectile = { x: 799, y: 200, vx: 250, vy: 0, radius: 8, mass: 1 }
    const escapedProjectile = { ...visibleProjectile, x: 899 }

    expect(isBodyOutsideViewport(visibleProjectile, 800, 500, 90)).toBe(false)
    expect(isBodyOutsideViewport(escapedProjectile, 800, 500, 90)).toBe(true)
  })

  it('absorbs only a settled impacted projectile inside the nucleus', () => {
    const settledProjectile = {
      x: 10,
      y: 0,
      vx: 10,
      vy: 0,
      radius: 8,
      mass: 1,
      hasImpacted: true,
      timeSinceImpact: 0.8,
    }

    expect(isProjectileAbsorbed(settledProjectile, { x: 0, y: 0 }, 80, 50, 0.65)).toBe(true)
    expect(isProjectileAbsorbed({ ...settledProjectile, vx: 120 }, { x: 0, y: 0 }, 80, 50, 0.65)).toBe(false)
    expect(isProjectileAbsorbed({ ...settledProjectile, hasImpacted: false }, { x: 0, y: 0 }, 80, 50, 0.65)).toBe(false)
  })

  it('eases an absorbed projectile out over time', () => {
    expect(calculateAbsorptionVisualState(0, 1.2)).toEqual({ opacity: 1, scale: 1 })

    const halfway = calculateAbsorptionVisualState(0.6, 1.2)
    expect(halfway.opacity).toBeCloseTo(0.5)
    expect(halfway.scale).toBeGreaterThan(0.55)

    expect(calculateAbsorptionVisualState(1.2, 1.2)).toEqual({ opacity: 0, scale: 0.55 })
  })

  it('aims a projectile at the requested speed', () => {
    const velocity = aimAt({ x: 0, y: 0 }, { x: 3, y: 4 }, 200)

    expect(Math.hypot(velocity.vx, velocity.vy)).toBeCloseTo(200)
    expect(velocity.vx).toBeCloseTo(120)
    expect(velocity.vy).toBeCloseTo(160)
  })

  it('separates rigid bodies and transfers momentum during a collision', () => {
    const first = { x: 0, y: 0, vx: 10, vy: 0, radius: 5, mass: 1 }
    const second = { x: 8, y: 0, vx: -10, vy: 0, radius: 5, mass: 1 }

    expect(resolveRigidCollision(first, second, 1)).toBe(true)
    expect(Math.hypot(second.x - first.x, second.y - first.y)).toBeCloseTo(10)
    expect(first.vx).toBeCloseTo(-10)
    expect(second.vx).toBeCloseTo(10)
  })

  it('propagates contact corrections through a dense cluster', () => {
    const bodies = [
      { x: 0, y: 0, vx: 0, vy: 0, radius: 5, mass: 1 },
      { x: 7, y: 0, vx: 0, vy: 0, radius: 5, mass: 1 },
      { x: 14, y: 0, vx: 0, vy: 0, radius: 5, mass: 1 },
      { x: 21, y: 0, vx: 0, vy: 0, radius: 5, mass: 1 },
    ]

    expect(resolveRigidCollisions(bodies, 24)).toBeGreaterThan(0)

    for (let firstIndex = 0; firstIndex < bodies.length; firstIndex += 1) {
      const first = bodies[firstIndex]
      if (!first) continue
      for (let secondIndex = firstIndex + 1; secondIndex < bodies.length; secondIndex += 1) {
        const second = bodies[secondIndex]
        if (!second) continue
        expect(Math.hypot(second.x - first.x, second.y - first.y)).toBeGreaterThanOrEqual(9.999)
      }
    }
  })
})
