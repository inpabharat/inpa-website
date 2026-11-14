import { describe, expect, it } from 'vitest'
import { audiencePathways, dedicatedSections, quickLinks, scienceDestinations } from '../../content/site/home'
import { navigationGroups, publicNavigationDestinations } from '../../content/site/navigation'
import { pendingRoutes } from '../../content/site/routes'

const requiredPublicDestinations = [
  '/about',
  '/about/presidents-message',
  '/about/executive-council',
  '/about/committees',
  '/research',
  '/nnpi',
  '/map',
  '/news',
  '/events',
  '/activities/young-scientist-colloquium',
  '/nuclear-horizons',
  '/nuclear-horizons/archive',
  '/community',
  '/membership',
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

  it('hides unpublished sections from routes and links', () => {
    const publicHomeLinks = [...audiencePathways, ...dedicatedSections, ...quickLinks, ...scienceDestinations]

    for (const path of ['/students', '/students/opportunities', '/people', '/jobs', '/awards']) {
      expect(pendingRoutes).not.toHaveProperty(path)
      expect(publicNavigationDestinations).not.toContain(path)
      expect(publicHomeLinks.some(link => link.to === path)).toBe(false)
    }
  })
})
