export interface LinkItem {
  label: string
  to: string
  icon: string
}

export const heroContent = {
  title: 'Indian Nuclear Physics Association',
  tagline: 'Advancing Nuclear Science • Connecting Researchers • Inspiring Future Generations',
  imageStatus: 'Development placeholder — approved panoramic scientific imagery and credits are required.',
  actions: [
    { label: 'Become a Member', to: '/membership' },
    { label: 'Nuclear Horizons', to: '/nuclear-horizons' },
    { label: 'Upcoming Conference', to: '/events' },
  ],
} as const

export const presidentContent = {
  status: 'Development placeholder — the President’s approved name, title, photograph and message are required.',
  title: 'A welcome from the President',
  message: 'This area is reserved for the concise, institutionally approved presidential welcome.',
  to: '/about/presidents-message',
} as const

export const aboutContent = {
  status: 'Development placeholder — official About copy requires institutional verification.',
  title: 'About INPA',
  summary: 'This section will introduce INPA’s verified purpose, community and institutional role.',
  to: '/about',
} as const

export const researchContent = {
  status: 'Development placeholder — a verified research selection, citation, permissions and accessible figure are required.',
  eyebrow: 'Research spotlight',
  title: 'Featured Indian nuclear-physics research will appear here',
  summary: 'The finished feature will pair an accessible scientific summary with verified authors, institutions, journal and canonical DOI.',
  to: '/research',
} as const

export const recurringFeatureContent = {
  status: 'Editorial framework ready — no scientific claim has been supplied.',
  eyebrow: 'INPA recurring feature',
  title: 'A curated scientific story for repeat visits',
  summary: 'The shared feature format supports Research of the Month, Historical Milestone, Figure of the Week, Nuclear Physics Explained and Did You Know?',
  requirements: 'Each published story must identify its author or source and include verified references and image permissions.',
} as const

export const nuclearHorizonsContent = {
  status: 'Development placeholder — the latest issue, cover, editorial, review, archive and submission route are required.',
  title: 'Nuclear Horizons',
  summary: 'The publication area is prepared for an approved issue package and will not claim a “most-read” article without verified analytics.',
  archiveTo: '/nuclear-horizons/archive',
} as const

export const studentResourceCategories = [
  'Lecture notes',
  'Recorded lectures',
  'PhD opportunities',
  'Summer schools',
  'Fellowships',
  'Career guidance',
  'Frequently asked questions',
] as const

export const quickLinks: LinkItem[] = [
  { label: 'Membership', to: '/membership', icon: 'M' },
  { label: 'Constitution', to: '/about/constitution', icon: '§' },
  { label: 'Executive Council', to: '/about/executive-council', icon: 'EC' },
  { label: 'Newsletter', to: '/nuclear-horizons', icon: 'NH' },
  { label: 'Awards', to: '/awards', icon: 'A' },
  { label: 'Jobs', to: '/jobs', icon: 'J' },
  { label: 'Contact', to: '/contact', icon: '@' },
  { label: 'Donations', to: '/membership#donations', icon: 'D' },
]

export const footerLinks = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Executive Council', to: '/about/executive-council' },
  { label: 'Accessibility', to: '/contact#accessibility' },
  { label: 'Sitemap', to: '/sitemap.xml' },
  { label: 'Report a content correction', to: '/contact#corrections' },
] as const
