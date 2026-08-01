export interface NavigationItem {
  label: string
  to: string
}

export const primaryNavigation: NavigationItem[] = [
  { label: 'About', to: '/about' },
  { label: 'News', to: '/news' },
  { label: 'Events', to: '/events' },
  { label: 'Research', to: '/research' },
  { label: 'Nuclear Horizons', to: '/nuclear-horizons' },
  { label: 'Students', to: '/students' },
  { label: 'India map', to: '/map' },
]
