export interface LinkItem {
  label: string
  to: string
  icon: string
}

export const heroContent = {
  title: 'Indian Nuclear Physics Association',
  tagline: 'Advancing Fundamental and Applied Nuclear Science for a Self-Reliant India',
  source: 'Official wording published in Nuclear Horizons, Volume 1, Issues 1 and 2 (2026).',
  imageStatus: 'Development placeholder — approved panoramic scientific imagery and credits are required.',
  actions: [
    { label: 'Become a Member', to: '/membership' },
    { label: 'Nuclear Horizons', to: '/nuclear-horizons' },
    { label: 'Upcoming Conference', to: '/events' },
  ],
} as const

export const presidentContent = {
  status: 'Identity and message summary verified from Nuclear Horizons, Volume 1, Issue 2 (June 2026). An approved portrait and photograph credit are still required.',
  title: 'Prof. A. K. Jain',
  role: 'President, Indian Nuclear Physics Association',
  affiliation: 'Indian Institute of Technology Roorkee',
  message: 'INPA is building a connected national community for nuclear physics, with priorities that include scientific collaboration, educational resources, laboratory training, mentorship and wider public awareness of nuclear science and its applications.',
  source: 'Summarised from the President’s Address in Nuclear Horizons, Volume 1, Issue 2 (June 2026).',
  to: '/about/presidents-message',
} as const

export const aboutContent = {
  status: 'Institutional facts are sourced from Nuclear Horizons, Volume 1, Issues 1 and 2. A formally approved full About statement is still required.',
  title: 'About INPA',
  summary: 'The Indian Nuclear Physics Association is a scientific society created as a national platform for India’s nuclear-physics community. INPA was formally registered on 2 May 2026 and seeks to support fundamental and applied research, collaboration, education, training and communication across universities, laboratories and the wider scientific community.',
  registration: 'Registration No. VAR/00818/2026-27',
  source: 'Nuclear Horizons, Volume 1, Issues 1 and 2 (2026).',
  to: '/about',
} as const

export const researchContent = {
  status: 'Article metadata and scientific scope are sourced from Nuclear Horizons, Volume 1, Issue 2. Article artwork is withheld pending web-republication permission.',
  eyebrow: 'Research spotlight',
  title: 'Nuclear Structure Studies: From Fundamental Symmetries to Exotic Nuclei',
  summary: 'This feature introduces how rotational, isospin, gauge and discrete symmetries guide nuclear models, conservation laws and the study of nuclear structure, including nuclei far from stability.',
  authors: 'Bijay Kumar Agrawal, Nisha Chandnani and Gaurav Saxena',
  institutions: 'Saha Institute of Nuclear Physics; Manipal University Jaipur; Government Women Engineering College, Ajmer',
  publication: 'Nuclear Horizons, Volume 1, Issue 2, June 2026',
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
  status: 'Issue metadata is verified from the supplied publications. Covers, PDFs and article artwork are not republished because written web permission has not been supplied.',
  title: 'Nuclear Horizons',
  descriptor: 'A Bulletin of the Indian Nuclear Physics Association',
  summary: 'Nuclear Horizons is INPA’s official bulletin and a platform for communication, collaboration and knowledge exchange across the nuclear-physics community.',
  chiefEditor: 'Dr. Soumya Bagchi, IIT (ISM) Dhanbad (as published in Issue 2)',
  issues: [
    { label: 'Volume 1, Issue 2', date: 'June 2026' },
    { label: 'Volume 1, Issue 1 — Inaugural Issue', date: 'January 2026' },
  ],
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
