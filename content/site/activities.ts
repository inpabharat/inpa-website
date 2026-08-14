export interface ColloquiumSeminar {
  sequence: string
  date: string
  datetime: string
  speaker: string
  affiliation: string
  title: string
  poster: string
}

export const youngScientistColloquium = {
  title: 'INPA Young Scientist Colloquium',
  description: 'A regular seminar series that gives young faculty members, postdoctoral researchers, research scholars and early-career scientists a platform to present and discuss their work.',
  callToAction: 'Researchers interested in speaking may submit the expression-of-interest form published in the programme poster.',
  coordinator: 'Sutanu Bhattacharya',
  jointCoordinator: 'Aniruddha Dey',
  email: 'inpa.bharat@gmail.com',
  speakerForm: 'https://forms.gle/8WmLZqho3MWCpVCa9',
  programmePoster: '/documents/inpa-young-scientist-colloquium.pdf',
  sourceNote: 'Programme and seminar details are taken from materials supplied directly by INPA in August 2026. The listed seminars are past events, not upcoming announcements.',
  seminars: [
    {
      sequence: 'Inaugural seminar',
      date: '26 June 2026 · 5:00 PM IST',
      datetime: '2026-06-26T17:00:00+05:30',
      speaker: 'Dr. Subhendu Rajbanshi',
      affiliation: 'Presidency University, Kolkata',
      title: 'Critical Point Symmetries in Atomic Nuclei: Experimental Evidences in Finite Many-Body Systems',
      poster: '/documents/inpa-colloquium-01-subhendu-rajbanshi.pdf',
    },
    {
      sequence: 'Second seminar',
      date: '25 July 2026 · 5:00 PM IST',
      datetime: '2026-07-25T17:00:00+05:30',
      speaker: 'Dr. Neelam J. Upadhyay',
      affiliation: 'Amity University Maharashtra',
      title: 'Computational and AI-Driven Frameworks for Nuclear Reaction Modelling: Applications to Astrophysical Reaction Mechanisms',
      poster: '/documents/inpa-colloquium-02-neelam-upadhyay.pdf',
    },
  ] satisfies readonly ColloquiumSeminar[],
} as const
