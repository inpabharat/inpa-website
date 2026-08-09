export type InstitutionCategory = 'dae-research' | 'research-institute' | 'national-facility'

export interface NuclearInstitution {
  id: string
  shortName: string
  name: string
  city: string
  state: string
  category: InstitutionCategory
  summary: string
  officialUrl: string
  coordinates: {
    latitude: number
    longitude: number
  }
  markerOffset?: {
    x: number
    y: number
  }
}

export const institutionCategories = [
  { id: 'all', label: 'All centres' },
  { id: 'dae-research', label: 'DAE research centres' },
  { id: 'research-institute', label: 'Research institutes' },
  { id: 'national-facility', label: 'National user facilities' },
] as const

/**
 * Curated national overview based on current DAE, UGC and institution sources.
 * Coordinates identify the institution's city/campus area for national-scale
 * orientation. Small marker offsets separate institutions that share a city.
 */
export const nuclearInstitutions: readonly NuclearInstitution[] = [
  {
    id: 'barc',
    shortName: 'BARC',
    name: 'Bhabha Atomic Research Centre',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'dae-research',
    summary: 'A multidisciplinary DAE research centre spanning nuclear science, engineering and societal applications.',
    officialUrl: 'https://www.barc.gov.in/',
    coordinates: { latitude: 19.018, longitude: 72.924 },
    markerOffset: { x: 1.2, y: -0.8 },
  },
  {
    id: 'igcar',
    shortName: 'IGCAR',
    name: 'Indira Gandhi Centre for Atomic Research',
    city: 'Kalpakkam',
    state: 'Tamil Nadu',
    category: 'dae-research',
    summary: 'A DAE research centre focused on fast-reactor science and technology and associated materials research.',
    officialUrl: 'https://www.igcar.gov.in/',
    coordinates: { latitude: 12.563, longitude: 80.166 },
  },
  {
    id: 'rrcat',
    shortName: 'RRCAT',
    name: 'Raja Ramanna Centre for Advanced Technology',
    city: 'Indore',
    state: 'Madhya Pradesh',
    category: 'dae-research',
    summary: 'A DAE research centre for accelerator, laser and related advanced technologies.',
    officialUrl: 'https://www.rrcat.gov.in/',
    coordinates: { latitude: 22.723, longitude: 75.809 },
    markerOffset: { x: 1.2, y: -0.8 },
  },
  {
    id: 'vecc',
    shortName: 'VECC',
    name: 'Variable Energy Cyclotron Centre',
    city: 'Kolkata',
    state: 'West Bengal',
    category: 'dae-research',
    summary: 'A DAE research centre operating accelerator facilities for nuclear science and allied research.',
    officialUrl: 'https://www.vecc.gov.in/',
    coordinates: { latitude: 22.601, longitude: 88.413 },
    markerOffset: { x: 1.3, y: -0.8 },
  },
  {
    id: 'amd',
    shortName: 'AMD',
    name: 'Atomic Minerals Directorate for Exploration and Research',
    city: 'Hyderabad',
    state: 'Telangana',
    category: 'dae-research',
    summary: 'The DAE unit responsible for exploration and evaluation of atomic-mineral resources.',
    officialUrl: 'https://amd.gov.in/',
    coordinates: { latitude: 17.443, longitude: 78.448 },
  },
  {
    id: 'gcnep',
    shortName: 'GCNEP',
    name: 'Global Centre for Nuclear Energy Partnership',
    city: 'Bahadurgarh',
    state: 'Haryana',
    category: 'dae-research',
    summary: 'A DAE centre for international collaboration, research and capacity-building in nuclear energy.',
    officialUrl: 'https://www.gcnep.gov.in/',
    coordinates: { latitude: 28.711, longitude: 76.825 },
  },
  {
    id: 'tifr',
    shortName: 'TIFR',
    name: 'Tata Institute of Fundamental Research',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'research-institute',
    summary: 'A DAE-supported institute for fundamental research, including nuclear and atomic physics.',
    officialUrl: 'https://www.tifr.res.in/',
    coordinates: { latitude: 18.907, longitude: 72.806 },
    markerOffset: { x: -1.3, y: 1 },
  },
  {
    id: 'sinp',
    shortName: 'SINP',
    name: 'Saha Institute of Nuclear Physics',
    city: 'Kolkata',
    state: 'West Bengal',
    category: 'research-institute',
    summary: 'A DAE-supported institute conducting basic research in nuclear physics and related disciplines.',
    officialUrl: 'https://www.saha.ac.in/web/',
    coordinates: { latitude: 22.601, longitude: 88.413 },
    markerOffset: { x: -1.5, y: 1 },
  },
  {
    id: 'iop',
    shortName: 'IoP',
    name: 'Institute of Physics',
    city: 'Bhubaneswar',
    state: 'Odisha',
    category: 'research-institute',
    summary: 'A DAE-supported research institute working across nuclear physics, high-energy physics and condensed matter physics.',
    officialUrl: 'https://www.iopb.res.in/',
    coordinates: { latitude: 20.306, longitude: 85.831 },
    markerOffset: { x: 1.1, y: -0.8 },
  },
  {
    id: 'niser',
    shortName: 'NISER',
    name: 'National Institute of Science Education and Research',
    city: 'Jatni',
    state: 'Odisha',
    category: 'research-institute',
    summary: 'A DAE-supported institution integrating science education with research, including nuclear and high-energy physics.',
    officialUrl: 'https://www.niser.ac.in/',
    coordinates: { latitude: 20.181, longitude: 85.688 },
    markerOffset: { x: -1.1, y: 1 },
  },
  {
    id: 'ipr',
    shortName: 'IPR',
    name: 'Institute for Plasma Research',
    city: 'Gandhinagar',
    state: 'Gujarat',
    category: 'research-institute',
    summary: 'A DAE-supported institute dedicated to plasma science and technologies, including fusion research.',
    officialUrl: 'https://www.ipr.res.in/',
    coordinates: { latitude: 23.144, longitude: 72.684 },
  },
  {
    id: 'iuac',
    shortName: 'IUAC',
    name: 'Inter-University Accelerator Centre',
    city: 'New Delhi',
    state: 'Delhi',
    category: 'national-facility',
    summary: 'A UGC national user facility providing university researchers with accelerator-based research infrastructure.',
    officialUrl: 'https://www.iuac.res.in/',
    coordinates: { latitude: 28.511, longitude: 77.174 },
  },
  {
    id: 'ugc-dae-csr',
    shortName: 'UGC–DAE CSR',
    name: 'UGC–DAE Consortium for Scientific Research',
    city: 'Indore',
    state: 'Madhya Pradesh',
    category: 'national-facility',
    summary: 'A consortium that enables university researchers to use major DAE facilities and associated research infrastructure.',
    officialUrl: 'https://www.csr.res.in/',
    coordinates: { latitude: 22.717, longitude: 75.873 },
    markerOffset: { x: -1.3, y: 1 },
  },
] as const

export function getInstitutionCategoryLabel(category: InstitutionCategory): string {
  return institutionCategories.find(item => item.id === category)?.label ?? category
}
