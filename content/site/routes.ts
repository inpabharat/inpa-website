export interface PendingRouteContent {
  title: string
  eyebrow: string
  description: string
  requiredContent: string
}

export const pendingRoutes: Record<string, PendingRouteContent> = {
  '/about': {
    title: 'About INPA',
    eyebrow: 'Institutional profile',
    description: 'This route is prepared for the verified institutional history, purpose and activities of INPA.',
    requiredContent: 'Approved About copy and organisation-name styling are required.',
  },
  '/about/presidents-message': {
    title: 'President’s message',
    eyebrow: 'Office of the President',
    description: 'This route is reserved for the complete, approved presidential address.',
    requiredContent: 'President’s name, title, photograph and final approved message are required.',
  },
  '/about/executive-council': {
    title: 'Executive Council',
    eyebrow: 'INPA leadership',
    description: 'This route is prepared for a verified current council listing.',
    requiredContent: 'The approved council roster, roles, terms and affiliations are required.',
  },
  '/about/constitution': {
    title: 'Constitution',
    eyebrow: 'Governance',
    description: 'This route is prepared for accessible constitution metadata and an approved document.',
    requiredContent: 'The current constitution file and publication status are required.',
  },
  '/research': {
    title: 'Featured research',
    eyebrow: 'Research spotlight',
    description: 'This archive will present curated and verified research features from India’s nuclear-physics community.',
    requiredContent: 'Approved selections, author and institution details, citations, DOI links and image permissions are required.',
  },
  '/nuclear-horizons': {
    title: 'Nuclear Horizons',
    eyebrow: 'INPA publication',
    description: 'This route is prepared to present the publication as an editorial experience rather than a bare file listing.',
    requiredContent: 'Approved issue metadata, cover, editorial, feature links and submission route are required.',
  },
  '/nuclear-horizons/archive': {
    title: 'Nuclear Horizons archive',
    eyebrow: 'Publication archive',
    description: 'This route is prepared for verified issue metadata and accessible PDF links.',
    requiredContent: 'Approved archive inventory, files, dates and cover credits are required.',
  },
  '/students': {
    title: 'Resources for students',
    eyebrow: 'Learn and progress',
    description: 'This route is prepared for owned, reviewed learning resources and career guidance.',
    requiredContent: 'Verified links, responsible owners and last-reviewed dates are required.',
  },
  '/students/opportunities': {
    title: 'Student opportunities',
    eyebrow: 'Current opportunities',
    description: 'This route will separate current opportunities from expired listings.',
    requiredContent: 'Verified opportunity owners, deadlines, destinations and review dates are required.',
  },
  '/map': {
    title: 'India’s nuclear physics map',
    eyebrow: 'National scientific resource',
    description: 'This route is prepared for a lightweight interactive map with a keyboard-accessible list alternative.',
    requiredContent: 'A verified institution dataset, profiles, official links and geographic data are required.',
  },
  '/people': {
    title: 'Distinguished scientists',
    eyebrow: 'Curated profiles',
    description: 'This route is prepared for verified pioneer and contemporary-scientist profiles.',
    requiredContent: 'Approved biographies, photographs, affiliations, dates, achievements and credits are required.',
  },
  '/community': {
    title: 'Member highlights',
    eyebrow: 'INPA community',
    description: 'This route is prepared for approved awards, books, recognitions, retirements and memorial notices.',
    requiredContent: 'Verified items and publication consent are required.',
  },
  '/awards': {
    title: 'Awards',
    eyebrow: 'Recognition',
    description: 'This route is prepared for official award information and verified announcements.',
    requiredContent: 'Approved award names, criteria, dates and destinations are required.',
  },
  '/jobs': {
    title: 'Jobs',
    eyebrow: 'Opportunities',
    description: 'This route is prepared for verified, current employment opportunities.',
    requiredContent: 'Official source links, owners, deadlines and review dates are required.',
  },
  '/membership': {
    title: 'Membership',
    eyebrow: 'Membership information',
    description: 'This is an informational boundary only; no account, payment or membership-management system is included.',
    requiredContent: 'The approved membership process, eligibility and destination URL are required.',
  },
  '/contact': {
    title: 'Contact INPA',
    eyebrow: 'Contact',
    description: 'This route is prepared for verified public contact, accessibility and content-correction channels.',
    requiredContent: 'The official office address, email, phone and responsible contacts are required.',
  },
  '/privacy': {
    title: 'Privacy Policy',
    eyebrow: 'Privacy',
    description: 'The current foundation collects no public personal data and uses no advertising or invasive analytics.',
    requiredContent: 'A formally reviewed privacy policy and responsible contact are required before launch.',
  },
}
