export interface ColloquiumSeminar {
  slug: string
  sequence: string
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
  seminars: [
    {
      slug: 'inpa-colloquium-01-subhendu-rajbanshi',
      sequence: 'Inaugural seminar',
      datetime: '2026-06-26T17:00:00+05:30',
      speaker: 'Dr. Subhendu Rajbanshi',
      affiliation: 'Presidency University, Kolkata',
      title: 'Critical Point Symmetries in Atomic Nuclei: Experimental Evidences in Finite Many-Body Systems',
      poster: '/documents/inpa-colloquium-01-subhendu-rajbanshi.pdf',
    },
    {
      slug: 'inpa-colloquium-02-neelam-upadhyay',
      sequence: 'Second seminar',
      datetime: '2026-07-25T17:00:00+05:30',
      speaker: 'Dr. Neelam J. Upadhyay',
      affiliation: 'Amity University Maharashtra',
      title: 'Computational and AI-Driven Frameworks for Nuclear Reaction Modelling: Applications to Astrophysical Reaction Mechanisms',
      poster: '/documents/inpa-colloquium-02-neelam-upadhyay.pdf',
    },
  ] satisfies readonly ColloquiumSeminar[],
} as const
