export interface BulletinSource {
  id: 'nuclear-horizons-1-1' | 'nuclear-horizons-1-2'
  title: string
  issueLabel: string
  publicationDate: string
  localFilename: string
  downloadPath: string
  coverImage: string
  pageCount: number
  fileSize: string
}

export const bulletinSources: BulletinSource[] = [
  {
    id: 'nuclear-horizons-1-1',
    title: 'Nuclear Horizons',
    issueLabel: 'Volume 1, Issue 1 (Inaugural Issue)',
    publicationDate: 'January 2026',
    localFilename: 'Inaugural_Issue_INPABulletin.pdf',
    downloadPath: '/publications/nuclear-horizons-volume-1-issue-1.pdf',
    coverImage: '/images/publications/nuclear-horizons-volume-1-issue-1.jpg',
    pageCount: 80,
    fileSize: '4.5 MB',
  },
  {
    id: 'nuclear-horizons-1-2',
    title: 'Nuclear Horizons',
    issueLabel: 'Volume 1, Issue 2',
    publicationDate: 'June 2026',
    localFilename: 'buletin2.pdf',
    downloadPath: '/publications/nuclear-horizons-volume-1-issue-2.pdf',
    coverImage: '/images/publications/nuclear-horizons-volume-1-issue-2.jpg',
    pageCount: 81,
    fileSize: '3.6 MB',
  },
]

export const bulletinContentNotice =
  'Institutional information is drawn from INPA’s published material and direct project correspondence.'

export const publicContact = {
  organisation: 'Indian Nuclear Physics Association (INPA)',
  email: 'inpa.bharat@gmail.com',
  secretary: 'Prof. Manoj Kumar Sharma',
  phoneDisplay: '+91 98373 82558',
  phoneHref: '+919837382558',
  address: 'Department of Physics, Institute of Science, Banaras Hindu University, Varanasi - 221005, Uttar Pradesh, India',
  source: 'Official INPA contact information.',
  missing: 'Official social-media destinations and a content-correction contact are still required.',
} as const

export const currentLeadership = {
  asOf: 'June 2026',
  president: {
    name: 'Prof. A. K. Jain',
    affiliation: 'Indian Institute of Technology Roorkee',
  },
  executiveSecretary: {
    name: 'Prof. Manoj Kumar Sharma',
    affiliation: 'University of Lucknow',
  },
  chiefEditor: {
    name: 'Dr. Soumya Bagchi',
    affiliation: 'IIT (ISM) Dhanbad',
  },
} as const
