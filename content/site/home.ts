export interface LinkItem {
  label: string
  to: string
  icon: string
}

export interface EditorialLinkItem {
  eyebrow: string
  title: string
  summary: string
  to: string
}

export interface VisionItem {
  mark: string
  title: string
  summary: string
  status: string
  to?: string
}

export interface CommunityHighlightItem {
  title: string
  date: string
  location: string
  image: string
  alt: string
  caption: string
}

export const heroContent = {
  title: 'Indian Nuclear Physics Association',
  tagline: 'Advancing Fundamental and Applied Nuclear Science for a Self-Reliant India',
  mission: 'Connecting People and Enabling Discovery',
  source: 'Mission confirmed in INPA website comments supplied in August 2026; institutional tagline published in Nuclear Horizons, Volume 1, Issues 1 and 2.',
  focusAreas: [
    'Fundamental and applied nuclear science',
    'National scientific collaboration',
    'Education, training and future generations',
  ],
  actions: [
    { label: 'Become a Member', to: '/membership' },
    { label: 'Nuclear Horizons', to: '/nuclear-horizons' },
    { label: 'Upcoming Conference', to: '/events' },
  ],
} as const

export const strategicVision = {
  eyebrow: 'One connected scientific ecosystem',
  title: 'Community • Voice • Roadmap',
  introduction: 'INPA connects the community, Nuclear Horizons carries its voice, and the developing NNPI framework is intended to help translate shared scientific aspirations into coordinated national action.',
  source: 'Strategic framing supplied by the INPA President in website comments received in August 2026. NNPI has not yet been formally announced.',
  verticals: [
    {
      mark: 'INPA',
      title: 'The Community',
      summary: 'The national association connecting people, institutions, disciplines and generations across nuclear physics.',
      status: 'Established association',
      to: '/about',
    },
    {
      mark: 'NH',
      title: 'The Voice',
      summary: 'Nuclear Horizons shares ideas, research perspectives, association activity and community knowledge.',
      status: 'Volume 1 published',
      to: '/nuclear-horizons',
    },
    {
      mark: 'NNPI',
      title: 'The Roadmap',
      summary: 'A community-driven framework being prepared to turn India’s nuclear-physics aspirations into coordinated action.',
      status: 'Framework in development',
      to: '/nnpi',
    },
  ] satisfies readonly VisionItem[],
  nnpi: {
    title: 'NNPI — From Vision to Action',
    descriptor: 'A Community Action Framework for Realizing the Mega Science Vision–2035',
    summary: 'Its developing structure brings together science priorities, national capabilities and community coordination. Formal public material and a simple framework figure are still being prepared.',
    pillars: ['Science', 'Capability', 'Community'],
    to: '/nnpi',
  },
} as const

export const audiencePathways: readonly EditorialLinkItem[] = [
  {
    eyebrow: 'Students and early-career researchers',
    title: 'I am a Student',
    summary: 'Explore the prepared framework for lectures, schools, fellowships, careers and frequently asked questions.',
    to: '/students',
  },
  {
    eyebrow: 'Researchers and faculty',
    title: 'I am a Researcher',
    summary: 'Discover verified research features, association news and Nuclear Horizons issue metadata.',
    to: '/research',
  },
  {
    eyebrow: 'Institutions and collaborators',
    title: 'I represent an Institution',
    summary: 'Use the accessible India map to explore a curated overview of major centres and facilities.',
    to: '/map',
  },
  {
    eyebrow: 'INPA community',
    title: 'I want to engage with INPA',
    summary: 'Find institutional information, events, membership guidance and approved community updates.',
    to: '/about',
  },
] as const

export const scienceDestinations: readonly EditorialLinkItem[] = [
  {
    eyebrow: 'Research spotlight',
    title: 'Curated Indian research',
    summary: 'Editorially selected features with verified authors, institutions and publication details.',
    to: '/research',
  },
  {
    eyebrow: 'Official bulletin',
    title: 'Nuclear Horizons',
    summary: 'Issue metadata, publication information and the future archive for INPA’s bulletin.',
    to: '/nuclear-horizons',
  },
  {
    eyebrow: 'National resource',
    title: 'Centres and facilities map',
    summary: 'A map and keyboard-accessible directory built from verified institutional sources.',
    to: '/map',
  },
  {
    eyebrow: 'Next generation',
    title: 'Student resources',
    summary: 'A structured destination ready for approved learning materials and opportunities.',
    to: '/students',
  },
] as const

export const presidentContent = {
  title: 'Prof. A. K. Jain',
  role: 'President, Indian Nuclear Physics Association',
  affiliation: 'Indian Institute of Technology Roorkee',
  message: 'INPA is building a connected national community for nuclear physics, with priorities that include scientific collaboration, educational resources, laboratory training, mentorship and wider public awareness of nuclear science and its applications.',
  to: '/about/presidents-message',
} as const

export const aboutContent = {
  status: 'Institutional facts are sourced from Nuclear Horizons, Volume 1, Issues 1 and 2. A formally approved full About statement is still required.',
  title: 'About INPA',
  summary: 'The Indian Nuclear Physics Association is a scientific society created as a national platform for India’s nuclear-physics community. INPA was formally registered on 2 May 2026 and seeks to support fundamental and applied research, collaboration, education, training and communication across universities, laboratories and the wider scientific community.',
  registration: 'Registration No. VAR/00818/2026-27',
  source: 'Nuclear Horizons, Volume 1, Issues 1 and 2 (2026).',
  to: '/about',
  image: {
    src: '/images/inpa-bhu-inauguration.jpg',
    alt: 'INPA members holding the inaugural issue of Nuclear Horizons at Banaras Hindu University',
    caption: 'INPA inauguration and Nuclear Horizons release at Banaras Hindu University, 21 April 2026. Photograph supplied by INPA.',
  },
} as const

export const communityHighlights = {
  introduction: 'Photographs from verified INPA activities and community occasions.',
  credit: 'Photographs supplied by INPA.',
  items: [
    {
      title: 'Nuclear Horizons inaugural issue',
      date: '21 April 2026',
      location: 'Banaras Hindu University, Varanasi',
      image: '/images/community-bhu-bulletin-release.jpg',
      alt: 'Participants displaying copies of the inaugural issue of Nuclear Horizons at Banaras Hindu University',
      caption: 'Participants with the inaugural issue of Nuclear Horizons at its release.',
    },
    {
      title: 'The community comes together',
      date: '21 April 2026',
      location: 'Banaras Hindu University, Varanasi',
      image: '/images/community-bhu-gathering.jpg',
      alt: 'INPA participants seated around a conference table during the inaugural gathering at Banaras Hindu University',
      caption: 'Members of the nuclear-physics community meet during INPA’s inaugural gathering.',
    },
    {
      title: 'A welcome at the inaugural gathering',
      date: '21 April 2026',
      location: 'Banaras Hindu University, Varanasi',
      image: '/images/community-bhu-welcome.jpg',
      alt: 'Two participants exchanging a bouquet during the INPA inaugural gathering at Banaras Hindu University',
      caption: 'A welcome during the gathering marking INPA’s inauguration at Banaras Hindu University.',
    },
    {
      title: 'Discussion at the inauguration',
      date: '21 April 2026',
      location: 'Banaras Hindu University, Varanasi',
      image: '/images/community-bhu-discussion.jpg',
      alt: 'Participants in discussion around a conference table during the INPA inaugural gathering',
      caption: 'A discussion during the gathering that formally introduced INPA and Nuclear Horizons.',
    },
  ] satisfies readonly CommunityHighlightItem[],
} as const

export const researchContent = {
  status: 'Featured in Nuclear Horizons, Volume 1, Issue 2. The complete article is available in the issue PDF.',
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
  requirements: 'Each published story will identify its author or source and include relevant references and media credits.',
} as const

export const nuclearHorizonsContent = {
  status: 'Both published issues are available to read or download from the Nuclear Horizons archive.',
  title: 'Nuclear Horizons',
  descriptor: 'A Bulletin of the Indian Nuclear Physics Association',
  summary: 'Nuclear Horizons is INPA’s official bulletin and a platform for communication, collaboration and knowledge exchange across the nuclear-physics community.',
  chiefEditor: 'Dr. Soumya Bagchi, IIT (ISM) Dhanbad (as published in Issue 2)',
  issues: [
    { label: 'Volume 1, Issue 2', date: 'June 2026', downloadPath: '/publications/nuclear-horizons-volume-1-issue-2.pdf' },
    { label: 'Volume 1, Issue 1 — Inaugural Issue', date: 'January 2026', downloadPath: '/publications/nuclear-horizons-volume-1-issue-1.pdf' },
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

export const dedicatedSections = [
  {
    mark: 'ST',
    title: 'Student resources',
    summary: 'Learning materials, opportunities and guidance.',
    to: '/students',
  },
  {
    mark: 'AR',
    title: 'Publication archive',
    summary: 'Verified Nuclear Horizons issue records.',
    to: '/nuclear-horizons/archive',
  },
  {
    mark: 'CG',
    title: 'Committees and governance',
    summary: 'Leadership, committee and governance information.',
    to: '/about/committees',
  },
  {
    mark: 'IN',
    title: 'Major centres and facilities',
    summary: 'The accessible national map and institution directory.',
    to: '/map',
  },
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
  { label: 'Young Scientist Colloquium', to: '/activities/young-scientist-colloquium' },
  { label: 'NNPI framework', to: '/nnpi' },
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Executive Council', to: '/about/executive-council' },
  { label: 'Accessibility', to: '/contact#accessibility' },
  { label: 'Sitemap', to: '/sitemap.xml' },
  { label: 'Report a content correction', to: '/contact#corrections' },
] as const
