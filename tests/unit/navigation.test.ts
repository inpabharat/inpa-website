import { describe, expect, it } from 'vitest'
import { navigationGroups, publicNavigationDestinations } from '../../content/site/navigation'

const requiredPublicDestinations = [
  '/about',
  '/about/presidents-message',
  '/about/executive-council',
  '/about/committees',
  '/about/constitution',
  '/research',
  '/nnpi',
  '/map',
  '/people',
  '/news',
  '/events',
  '/activities/young-scientist-colloquium',
  '/nuclear-horizons',
  '/nuclear-horizons/archive',
  '/students',
  '/students/opportunities',
  '/jobs',
  '/community',
  '/membership',
  '/awards',
  '/contact',
  '/privacy',
]

describe('public navigation', () => {
  it('keeps group identifiers and link targets unique', () => {
    const groupIds = navigationGroups.map(group => group.id)
    const groupedTargets = navigationGroups.flatMap(group => group.links.map(link => link.to))

    expect(new Set(groupIds).size).toBe(groupIds.length)
    expect(new Set(groupedTargets).size).toBe(groupedTargets.length)
  })

  it('makes every required public destination discoverable', () => {
    for (const destination of requiredPublicDestinations) {
      expect(publicNavigationDestinations).toContain(destination)
    }
  })

  it('does not expose the protected editor surface', () => {
    expect(publicNavigationDestinations.some(path => path.startsWith('/admin'))).toBe(false)
  })
})
