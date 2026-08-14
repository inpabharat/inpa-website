export interface BulletinSource {
  id: 'nuclear-horizons-1-1' | 'nuclear-horizons-1-2'
  title: string
  issueLabel: string
  publicationDate: string
  localFilename: string
}

export const bulletinSources: BulletinSource[] = [
  {
    id: 'nuclear-horizons-1-1',
    title: 'Nuclear Horizons',
    issueLabel: 'Volume 1, Issue 1 (Inaugural Issue)',
    publicationDate: 'January 2026',
    localFilename: 'Inaugural_Issue_INPABulletin.pdf',
  },
  {
    id: 'nuclear-horizons-1-2',
    title: 'Nuclear Horizons',
    issueLabel: 'Volume 1, Issue 2',
    publicationDate: 'June 2026',
    localFilename: 'buletin2.pdf',
  },
]

export const bulletinContentNotice =
  'Source: Nuclear Horizons, Volume 1, Issues 1 and 2 (2026). Website copy is a concise factual summary. The supplied issues state that reproduction requires prior written permission from INPA, so their PDFs, photographs and article artwork are not published by this local site.'

export const publicContact = {
  organisation: 'Indian Nuclear Physics Association (INPA)',
  email: 'inpa.bharat@gmail.com',
  secretary: 'Prof. Manoj Kumar Sharma',
  phoneDisplay: '+91 98373 82558',
  phoneHref: '+919837382558',
  address: 'Department of Physics, Institute of Science, Banaras Hindu University, Varanasi - 221005, Uttar Pradesh, India',
  source: 'Approved by the INPA President in correspondence dated 10 August 2026.',
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
