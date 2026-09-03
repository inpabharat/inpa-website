export interface NavigationLink {
  label: string
  to: string
  description?: string
  status?: string
}

export interface NavigationGroup {
  id: string
  label: string
  description: string
  links: readonly NavigationLink[]
}

export const navigationGroups: readonly NavigationGroup[] = [
  {
    id: 'about',
    label: 'About',
    description: 'INPA’s purpose, leadership and governance.',
    links: [
      { label: 'About INPA', to: '/about', description: 'Formation, registration and published objectives.' },
      { label: 'President’s Message', to: '/about/presidents-message' },
      { label: 'Executive Council', to: '/about/executive-council' },
      { label: 'Committees and Governance', to: '/about/committees' },
      { label: 'Constitution', to: '/about/constitution' },
      { label: 'Contact INPA', to: '/contact' },
    ],
  },
  {
    id: 'science',
    label: 'Science',
    description: 'Research, national initiatives and scientific institutions.',
    links: [
      { label: 'NNPI Framework', to: '/nnpi', description: 'From vision to coordinated national action.' },
      { label: 'Featured Research', to: '/research', description: 'Curated, source-backed Indian nuclear-physics research.' },
      { label: 'Major Centres and Facilities', to: '/map' },
      { label: 'Distinguished Scientists', to: '/people' },
    ],
  },
  {
    id: 'updates',
    label: 'News & Events',
    description: 'Announcements, dates and established scientific programmes.',
    links: [
      { label: 'News Archive', to: '/news', description: 'Verified announcements from across INPA.' },
      { label: 'Events Archive', to: '/events' },
      { label: 'Young Scientist Colloquium', to: '/activities/young-scientist-colloquium' },
    ],
  },
  {
    id: 'publications',
    label: 'Publications',
    description: 'INPA publications and verified issue records.',
    links: [
      { label: 'Nuclear Horizons', to: '/nuclear-horizons', description: 'The official bulletin of INPA.' },
      { label: 'Issue Archive', to: '/nuclear-horizons/archive' },
    ],
  },
  {
    id: 'students',
    label: 'Students',
    description: 'Learning resources and verified opportunities.',
    links: [
      { label: 'Student Resources', to: '/students', description: 'Prepared routes for lectures, schools and guidance.' },
      { label: 'Student Opportunities', to: '/students/opportunities' },
      { label: 'Jobs', to: '/jobs' },
    ],
  },
  {
    id: 'community',
    label: 'Community',
    description: 'Participation, recognition and community activity.',
    links: [
      { label: 'Community Highlights', to: '/community', description: 'Approved community records and recognition.' },
      { label: 'Membership', to: '/membership' },
      { label: 'Awards and Recognition', to: '/awards' },
    ],
  },
] as const

export const utilityNavigation: readonly NavigationLink[] = [
  { label: 'Contact', to: '/contact' },
  { label: 'Privacy', to: '/privacy' },
  { label: 'Accessibility', to: '/contact#accessibility' },
  { label: 'Sitemap', to: '/sitemap.xml' },
  { label: 'Report a correction', to: '/contact#corrections' },
] as const

export const publicNavigationDestinations = [
  ...navigationGroups.flatMap(group => group.links.map(link => link.to)),
  ...utilityNavigation.map(link => link.to),
] as const
