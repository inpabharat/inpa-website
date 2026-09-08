export type InstitutionCategory =
  | 'national-laboratory'
  | 'national-facility'
  | 'research-institute'
  | 'university'
  | 'iit-nit-iiser'
  | 'college'
  | 'specialized-centre'

export type ResearchCharacter = 'Experimental' | 'Theory' | 'Experimental + Theory' | 'Experimental / Applied' | 'Interdisciplinary' | 'Nuclear Physics'

export interface LandscapeResearcher {
  id: string
  name: string
  designation?: string
}

export interface LandscapeFacility {
  id: string
  name: string
  capability?: string
  isUserFacility?: boolean
  officialUrl?: string
}

export interface NuclearInstitution {
  id: string
  shortName: string
  name: string
  city: string
  state: string
  category: InstitutionCategory
  summary: string
  officialUrl?: string
  department?: string
  region?: 'North' | 'East' | 'West' | 'Central' | 'Northeast' | 'South'
  character?: ResearchCharacter
  researchAreas?: readonly string[]
  researchers?: readonly LandscapeResearcher[]
  facilities?: readonly LandscapeFacility[]
  verificationStatus?: 'verified-v1' | 'institution-source'
  lastVerified?: string
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
  { id: 'all', label: 'All institutions' },
  { id: 'national-laboratory', label: 'National laboratories' },
  { id: 'research-institute', label: 'Research institutes' },
  { id: 'national-facility', label: 'National user facilities' },
  { id: 'university', label: 'Universities' },
  { id: 'iit-nit-iiser', label: 'IITs / NITs / IISERs' },
  { id: 'college', label: 'Colleges' },
  { id: 'specialized-centre', label: 'Specialized centres' },
] as const

export const scientificAreas = [
  'Nuclear Structure',
  'Nuclear Reactions',
  'Nuclear Theory',
  'Nuclear Astrophysics',
  'Nuclear Data',
  'Nuclear Decay & Isomers',
  'Accelerator Physics',
  'Detectors & Instrumentation',
  'High-Energy Nuclear Physics',
  'Radiation/Nuclear Applications',
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
    category: 'national-laboratory',
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
    category: 'national-laboratory',
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
    category: 'national-laboratory',
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
    category: 'national-laboratory',
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
    category: 'national-laboratory',
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
    category: 'specialized-centre',
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
    region: 'North',
    character: 'Experimental',
    researchAreas: ['Nuclear Structure', 'Nuclear Reactions', 'Accelerator Physics', 'Detectors & Instrumentation'],
    facilities: [{ id: 'dl01-iuac-complex', name: 'IUAC accelerator complex', capability: 'Recoil separation, gamma spectroscopy, neutron and charged-particle detection', isUserFacility: true, officialUrl: 'https://www.iuac.res.in/' }],
    verificationStatus: 'verified-v1',
    lastVerified: '2026-09',
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
  {
    id: 'dl-02-du-npl', shortName: 'DU NPL', name: 'University of Delhi, Nuclear Physics Laboratory', city: 'Delhi', state: 'Delhi', region: 'North', category: 'university', character: 'Experimental', summary: 'An academic nuclear-physics laboratory active in structure, reactions and spectroscopy.', researchAreas: ['Nuclear Structure', 'Nuclear Reactions', 'Detectors & Instrumentation'], coordinates: { latitude: 28.69, longitude: 77.21 }, verificationStatus: 'verified-v1', lastVerified: '2026-09',
  },
  {
    id: 'dl-03-hansraj', shortName: 'Hansraj', name: 'Hansraj College, University of Delhi', city: 'Delhi', state: 'Delhi', region: 'North', category: 'college', character: 'Experimental / Applied', summary: 'Active nuclear-physics and radiation-detection research.', researchAreas: ['Detectors & Instrumentation', 'Radiation/Nuclear Applications'], researchers: [{ id: 'dl03-jnaneswari-gellanki', name: 'Dr Jnaneswari Gellanki' }], coordinates: { latitude: 28.68, longitude: 77.21 }, markerOffset: { x: -1.5, y: 1.5 }, verificationStatus: 'verified-v1', lastVerified: '2026-09',
  },
  {
    id: 'dl-04-maitreyi', shortName: 'Maitreyi', name: 'Maitreyi College, University of Delhi', city: 'Delhi', state: 'Delhi', region: 'North', category: 'college', character: 'Experimental', summary: 'An active group in nuclear structure and gamma spectroscopy.', researchAreas: ['Nuclear Structure', 'Detectors & Instrumentation'], researchers: [{ id: 'dl04-bharti-rohila', name: 'Dr Bharti Rohila' }], coordinates: { latitude: 28.59, longitude: 77.17 }, markerOffset: { x: 1.5, y: 1.5 }, verificationStatus: 'verified-v1', lastVerified: '2026-09',
  },
  {
    id: 'up-01-bhu', shortName: 'BHU', name: 'Banaras Hindu University, Institute of Science', city: 'Varanasi', state: 'Uttar Pradesh', region: 'North', category: 'university', character: 'Experimental + Theory', summary: 'Research spans nuclear structure, reactions, spectroscopy, nuclear data and theory.', researchAreas: ['Nuclear Structure', 'Nuclear Reactions', 'Nuclear Theory', 'Nuclear Data'], researchers: [{ id: 'up01-hp-sharma', name: 'Prof H. P. Sharma' }, { id: 'up01-ajay-kumar', name: 'Prof Ajay Kumar' }, { id: 'up01-vikas-kumar', name: 'Dr Vikas Kumar' }], coordinates: { latitude: 25.27, longitude: 82.99 }, verificationStatus: 'verified-v1', lastVerified: '2026-09',
  },
  {
    id: 'up-02-iit-bhu', shortName: 'IIT (BHU)', name: 'Indian Institute of Technology (BHU)', city: 'Varanasi', state: 'Uttar Pradesh', region: 'North', category: 'iit-nit-iiser', character: 'Experimental', summary: 'Research includes high-spin nuclear structure, isomers, gamma spectroscopy and relativistic heavy-ion collisions.', researchAreas: ['Nuclear Structure', 'Nuclear Decay & Isomers', 'High-Energy Nuclear Physics'], researchers: [{ id: 'up02-somnath-nag', name: 'Dr Somnath Nag' }, { id: 'up02-dhananjaya-thakur', name: 'Dr Dhananjaya Thakur' }], coordinates: { latitude: 25.26, longitude: 82.99 }, markerOffset: { x: 1.4, y: 1 }, verificationStatus: 'verified-v1', lastVerified: '2026-09',
  },
  {
    id: 'up-03-amu', shortName: 'AMU', name: 'Aligarh Muslim University', city: 'Aligarh', state: 'Uttar Pradesh', region: 'North', category: 'university', character: 'Interdisciplinary', summary: 'Experimental and theoretical work on heavy-ion reactions, nuclear structure and neutrino–nucleus interactions.', researchAreas: ['Nuclear Reactions', 'Nuclear Structure', 'Nuclear Theory', 'High-Energy Nuclear Physics'], researchers: [{ id: 'up03-mohammad-shuaib', name: 'Dr Mohammad Shuaib' }, { id: 'up03-shakeb-ahmad', name: 'Prof Shakeb Ahmad' }, { id: 'up03-ms-athar', name: 'Prof Mohammad Sajjad Athar' }, { id: 'up03-mr-alam', name: 'Dr Mohammad Rafi Alam' }], coordinates: { latitude: 27.91, longitude: 78.08 }, verificationStatus: 'verified-v1', lastVerified: '2026-09',
  },
  {
    id: 'up-04-iitk', shortName: 'IITK', name: 'Indian Institute of Technology Kanpur', city: 'Kanpur', state: 'Uttar Pradesh', region: 'North', category: 'iit-nit-iiser', character: 'Experimental', summary: 'Ion-beam, accelerator-physics and nuclear or atomic measurements and applications.', researchAreas: ['Accelerator Physics', 'Radiation/Nuclear Applications'], facilities: [{ id: 'up04-tandetron', name: 'Tandetron accelerator', capability: 'Ion-beam measurements and applications' }], coordinates: { latitude: 26.51, longitude: 80.23 }, verificationStatus: 'verified-v1', lastVerified: '2026-09',
  },
  {
    id: 'up-05-lucknow', shortName: 'Lucknow', name: 'University of Lucknow', city: 'Lucknow', state: 'Uttar Pradesh', region: 'North', category: 'university', character: 'Experimental + Theory', summary: 'Research in heavy-ion reactions, fusion, nuclear structure and nuclear-decay theory.', researchAreas: ['Nuclear Reactions', 'Nuclear Structure', 'Nuclear Theory', 'Nuclear Decay & Isomers'], researchers: [{ id: 'up05-mk-sharma', name: 'Prof Manoj Kumar Sharma' }, { id: 'up05-amritanshu-shukla', name: 'Prof Amritanshu Shukla' }, { id: 'up05-vinod-kumar', name: 'Vinod Kumar' }], coordinates: { latitude: 26.86, longitude: 80.94 }, verificationStatus: 'verified-v1', lastVerified: '2026-09',
  },
  {
    id: 'up-06-allahabad', shortName: 'AU', name: 'University of Allahabad', city: 'Prayagraj', state: 'Uttar Pradesh', region: 'North', category: 'university', character: 'Theory', summary: 'Theoretical nuclear physics and related nuclear and particle research.', researchAreas: ['Nuclear Theory'], coordinates: { latitude: 25.46, longitude: 81.85 }, verificationStatus: 'verified-v1', lastVerified: '2026-09',
  },
  {
    id: 'up-07-ainst', shortName: 'AINST', name: 'Amity Institute of Nuclear Science & Technology', city: 'Noida', state: 'Uttar Pradesh', region: 'North', category: 'specialized-centre', character: 'Experimental / Applied', summary: 'Accelerator-based nuclear reactions, nuclear astrophysics, radiation detection and nuclear instrumentation.', researchAreas: ['Nuclear Reactions', 'Nuclear Astrophysics', 'Detectors & Instrumentation', 'Radiation/Nuclear Applications'], researchers: [{ id: 'up07-alpana-goel', name: 'Prof Alpana Goel' }, { id: 'up07-unnati-gupta', name: 'Dr Unnati Gupta' }, { id: 'up07-sudatta-ray', name: 'Dr Sudatta Ray' }, { id: 'up07-abhishek-yadav', name: 'Dr Abhishek Yadav' }, { id: 'up07-archana-yadav', name: 'Ms Archana Yadav' }], coordinates: { latitude: 28.54, longitude: 77.33 }, verificationStatus: 'verified-v1', lastVerified: '2026-09',
  },
  {
    id: 'up-08-snu', shortName: 'SNU', name: 'Shiv Nadar University', city: 'Greater Noida', state: 'Uttar Pradesh', region: 'North', category: 'university', character: 'Experimental + Theory', summary: 'Research in nuclear structure, isomers, superheavy nuclei and nuclear astrophysics.', researchAreas: ['Nuclear Structure', 'Nuclear Decay & Isomers', 'Nuclear Astrophysics'], researchers: [{ id: 'up08-sujit-tandel', name: 'Prof Sujit K. Tandel' }, { id: 'up08-bhaskar-biswas', name: 'Bhaskar Biswas' }], coordinates: { latitude: 28.53, longitude: 77.57 }, verificationStatus: 'verified-v1', lastVerified: '2026-09',
  },
  {
    id: 'up-09-bareilly', shortName: 'Bareilly', name: 'Bareilly College / M.J.P. Rohilkhand University Context', city: 'Bareilly', state: 'Uttar Pradesh', region: 'North', category: 'college', character: 'Nuclear Physics', summary: 'A university-affiliated college entry representing active nuclear-physics research.', researchAreas: ['Nuclear Structure'], researchers: [{ id: 'up09-avinash-agrawal', name: 'Dr Avinash Agrawal' }], coordinates: { latitude: 28.37, longitude: 79.43 }, verificationStatus: 'verified-v1', lastVerified: '2026-09',
  },
  {
    id: 'pb-01-tiet', shortName: 'TIET', name: 'Thapar Institute of Engineering & Technology', city: 'Patiala', state: 'Punjab', region: 'North', category: 'university', character: 'Experimental + Theory', summary: 'Research includes heavy-ion reactions, fusion and fission, nuclear structure and astrophysics.', researchAreas: ['Nuclear Reactions', 'Nuclear Structure', 'Nuclear Astrophysics'], researchers: [{ id: 'pb01-mk-sharma', name: 'Prof Manoj Kumar Sharma' }, { id: 'pb01-raj-kumar', name: 'Dr Raj Kumar' }, { id: 'pb01-sunil-devi', name: 'Dr Sunil Devi' }], coordinates: { latitude: 30.35, longitude: 76.36 }, verificationStatus: 'verified-v1', lastVerified: '2026-09',
  },
  {
    id: 'pb-02-iitrpr', shortName: 'IIT Ropar', name: 'Indian Institute of Technology Ropar', city: 'Rupnagar', state: 'Punjab', region: 'North', category: 'iit-nit-iiser', character: 'Experimental', summary: 'Research in nuclear reactions, structure, high-spin physics, isomers, fission and instrumentation.', researchAreas: ['Nuclear Reactions', 'Nuclear Structure', 'Nuclear Decay & Isomers', 'Detectors & Instrumentation'], researchers: [{ id: 'pb02-pp-singh', name: 'Dr Pushpendra P. Singh' }, { id: 'pb02-deepika-choudhury', name: 'Dr Deepika Choudhury' }], coordinates: { latitude: 30.97, longitude: 76.53 }, verificationStatus: 'verified-v1', lastVerified: '2026-09',
  },
  {
    id: 'pb-03-gndu', shortName: 'GNDU', name: 'Guru Nanak Dev University', city: 'Amritsar', state: 'Punjab', region: 'North', category: 'university', character: 'Theory', summary: 'Theoretical work in nuclear structure, rotational bands and fission.', researchAreas: ['Nuclear Structure', 'Nuclear Theory'], researchers: [{ id: 'pb03-harjeet-kaur', name: 'Dr Harjeet Kaur' }], coordinates: { latitude: 31.63, longitude: 74.83 }, verificationStatus: 'verified-v1', lastVerified: '2026-09',
  },
  {
    id: 'pb-04-akal', shortName: 'Akal', name: 'Akal University', city: 'Talwandi Sabo', state: 'Punjab', region: 'North', category: 'university', character: 'Theory', summary: 'Research in nuclear structure, high-spin phenomena, decay-data evaluation and reaction studies.', researchAreas: ['Nuclear Structure', 'Nuclear Theory', 'Nuclear Data'], researchers: [{ id: 'pb04-sukhjeet-singh', name: 'Prof Sukhjeet Singh' }, { id: 'pb04-sushil-kumar', name: 'Dr Sushil Kumar' }], coordinates: { latitude: 29.99, longitude: 75.08 }, verificationStatus: 'verified-v1', lastVerified: '2026-09',
  },
  {
    id: 'pb-05-nitj', shortName: 'NITJ', name: 'Dr B. R. Ambedkar National Institute of Technology Jalandhar', city: 'Jalandhar', state: 'Punjab', region: 'North', category: 'iit-nit-iiser', character: 'Theory', summary: 'Theoretical and applied activity in nuclear and radiation physics.', researchAreas: ['Nuclear Theory', 'Radiation/Nuclear Applications'], coordinates: { latitude: 31.4, longitude: 75.54 }, verificationStatus: 'verified-v1', lastVerified: '2026-09',
  },
  {
    id: 'ch-01-pu', shortName: 'PU', name: 'Panjab University', city: 'Chandigarh', state: 'Chandigarh', region: 'North', category: 'university', character: 'Experimental + Theory', summary: 'Academic research in nuclear structure, reaction dynamics, spectroscopy and theory, with an accelerator facility.', researchAreas: ['Nuclear Structure', 'Nuclear Reactions', 'Nuclear Theory', 'Accelerator Physics'], facilities: [{ id: 'ch01-cyclotron', name: 'Cyclotron', capability: 'Accelerator-based nuclear research' }], coordinates: { latitude: 30.76, longitude: 76.77 }, verificationStatus: 'verified-v1', lastVerified: '2026-09',
  },
  {
    id: 'ch-02-sggs', shortName: 'SGGS', name: 'Sri Guru Gobind Singh College', city: 'Chandigarh', state: 'Chandigarh', region: 'North', category: 'college', character: 'Experimental + Theory', summary: 'Experimental and theoretical nuclear physics, including heavy-ion reaction studies.', researchAreas: ['Nuclear Reactions', 'Nuclear Structure', 'Nuclear Theory'], researchers: [{ id: 'ch02-kuljeet-chakkal', name: 'Dr Kuljeet Singh Chakkal' }, { id: 'ch02-arshdeep-sidhu', name: 'Dr Arshdeep Kaur Sidhu' }, { id: 'ch02-vipenpal-singh', name: 'Dr Vipenpal Singh' }, { id: 'ch02-sukhjit-kaur', name: 'Dr Sukhjit Kaur' }], coordinates: { latitude: 30.74, longitude: 76.78 }, markerOffset: { x: 1.5, y: 1.5 }, verificationStatus: 'verified-v1', lastVerified: '2026-09',
  },
  {
    id: 'utk-01-iitr', shortName: 'IITR', name: 'Indian Institute of Technology Roorkee', city: 'Roorkee', state: 'Uttarakhand', region: 'North', category: 'iit-nit-iiser', character: 'Experimental + Theory', summary: 'Research in nuclear structure, reactions, isomers, data, theory, detectors and nuclear astrophysics.', researchAreas: ['Nuclear Structure', 'Nuclear Reactions', 'Nuclear Theory', 'Nuclear Data', 'Nuclear Astrophysics', 'Detectors & Instrumentation'], coordinates: { latitude: 29.87, longitude: 77.9 }, verificationStatus: 'verified-v1', lastVerified: '2026-09',
  },
  {
    id: 'hp-01-hpu', shortName: 'HPU', name: 'Himachal Pradesh University', city: 'Shimla', state: 'Himachal Pradesh', region: 'North', category: 'university', character: 'Theory', summary: 'Theoretical work in nuclear structure, density-functional theory and nuclear astrophysics.', researchAreas: ['Nuclear Structure', 'Nuclear Theory', 'Nuclear Astrophysics'], researchers: [{ id: 'hp01-sk-dhiman', name: 'Prof Shashi K. Dhiman' }, { id: 'hp01-rk-jagota', name: 'Dr Raj Kumar Jagota' }], coordinates: { latitude: 31.11, longitude: 77.14 }, verificationStatus: 'verified-v1', lastVerified: '2026-09',
  },
  {
    id: 'hp-02-cuhp', shortName: 'CUHP', name: 'Central University of Himachal Pradesh', city: 'Dharamshala', state: 'Himachal Pradesh', region: 'North', category: 'university', character: 'Theory', summary: 'Nuclear structure and theory with related nuclear and high-energy studies.', researchAreas: ['Nuclear Structure', 'Nuclear Theory', 'High-Energy Nuclear Physics'], coordinates: { latitude: 32.22, longitude: 76.32 }, verificationStatus: 'verified-v1', lastVerified: '2026-09',
  },
  {
    id: 'jk-01-kashmir', shortName: 'UoK', name: 'University of Kashmir', city: 'Srinagar', state: 'Jammu & Kashmir', region: 'North', category: 'university', character: 'Theory', summary: 'A nuclear theory group working in structure, density-functional theory, fission and astrophysics.', researchAreas: ['Nuclear Structure', 'Nuclear Theory', 'Nuclear Astrophysics'], coordinates: { latitude: 34.13, longitude: 74.84 }, verificationStatus: 'verified-v1', lastVerified: '2026-09',
  },
  {
    id: 'jk-02-jammu', shortName: 'JU', name: 'University of Jammu', city: 'Jammu', state: 'Jammu & Kashmir', region: 'North', category: 'university', character: 'Theory', summary: 'Theoretical research in nuclear structure, reactions, microscopic theory and high-energy nuclear physics.', researchAreas: ['Nuclear Structure', 'Nuclear Reactions', 'Nuclear Theory', 'High-Energy Nuclear Physics'], researchers: [{ id: 'jk02-arun-bharti', name: 'Prof Arun Bharti' }, { id: 'jk02-rani-devi', name: 'Prof Rani Devi' }], coordinates: { latitude: 32.73, longitude: 74.87 }, verificationStatus: 'verified-v1', lastVerified: '2026-09',
  },
  {
    id: 'jk-03-cuk', shortName: 'CUK', name: 'Central University of Kashmir', city: 'Ganderbal', state: 'Jammu & Kashmir', region: 'North', category: 'university', character: 'Experimental', summary: 'Experimental activity in heavy-ion nuclear reactions and associated nuclear physics.', researchAreas: ['Nuclear Reactions'], coordinates: { latitude: 34.22, longitude: 74.77 }, markerOffset: { x: 1.5, y: 1 }, verificationStatus: 'verified-v1', lastVerified: '2026-09',
  },
  {
    id: 'jk-04-cuj', shortName: 'CUJ', name: 'Central University of Jammu', city: 'Jammu', state: 'Jammu & Kashmir', region: 'North', category: 'university', character: 'Nuclear Physics', summary: 'Active work in nuclear structure and related nuclear physics.', researchAreas: ['Nuclear Structure'], researchers: [{ id: 'jk04-suram-singh', name: 'Prof Suram Singh' }, { id: 'jk04-manvi-rajput', name: 'Dr Manvi Rajput' }], coordinates: { latitude: 32.64, longitude: 74.95 }, markerOffset: { x: 1.4, y: 1.2 }, verificationStatus: 'verified-v1', lastVerified: '2026-09',
  },
  {
    id: 'jk-05-aaam', shortName: 'AAAM', name: 'AAAM Degree College, Bemina', city: 'Srinagar', state: 'Jammu & Kashmir', region: 'North', category: 'college', character: 'Theory', summary: 'Theoretical research in nuclear optical models and nucleon–nucleus scattering.', researchAreas: ['Nuclear Theory', 'Nuclear Reactions'], researchers: [{ id: 'jk05-syed-rafi-ahmad', name: 'Dr Syed Rafi Ahmad' }], coordinates: { latitude: 34.06, longitude: 74.81 }, markerOffset: { x: -1.6, y: 1.2 }, verificationStatus: 'verified-v1', lastVerified: '2026-09',
  },
  {
    id: 'jk-06-shopian', shortName: 'GDC Shopian', name: 'Government Degree College, Shopian', city: 'Shopian', state: 'Jammu & Kashmir', region: 'North', category: 'college', character: 'Theory', summary: 'Theoretical work in nuclear structure, TPSM, chirality, wobbling and shape evolution.', researchAreas: ['Nuclear Structure', 'Nuclear Theory'], researchers: [{ id: 'jk06-gh-bhat', name: 'Dr Gowhar Hussain Bhat' }], coordinates: { latitude: 33.72, longitude: 74.83 }, verificationStatus: 'verified-v1', lastVerified: '2026-09',
  },
  {
    id: 'jk-07-rspura', shortName: 'GDC R.S. Pura', name: 'Government Degree College, R.S. Pura', city: 'R.S. Pura', state: 'Jammu & Kashmir', region: 'North', category: 'college', character: 'Nuclear Physics', summary: 'Active nuclear-physics research.', researchAreas: ['Nuclear Structure'], researchers: [{ id: 'jk07-neeru-sawhney', name: 'Dr Neeru Sawhney' }], coordinates: { latitude: 32.61, longitude: 74.73 }, markerOffset: { x: -1.5, y: 1 }, verificationStatus: 'verified-v1', lastVerified: '2026-09',
  },
  {
    id: 'rj-01-rajasthan', shortName: 'UoR', name: 'University of Rajasthan', city: 'Jaipur', state: 'Rajasthan', region: 'North', category: 'university', character: 'Experimental / Applied', summary: 'Experimental nuclear physics, gamma spectroscopy, neutron activation and radiation studies.', researchAreas: ['Nuclear Structure', 'Nuclear Data', 'Radiation/Nuclear Applications', 'High-Energy Nuclear Physics'], researchers: [{ id: 'rj01-sk-gupta', name: 'Prof S. K. Gupta' }, { id: 'rj01-dalpat-meena', name: 'Dr Dalpat Meena' }], coordinates: { latitude: 26.89, longitude: 75.81 }, verificationStatus: 'verified-v1', lastVerified: '2026-09',
  },
  {
    id: 'rj-02-gweca', shortName: 'GWEC Ajmer', name: 'Government Women Engineering College, Ajmer', city: 'Ajmer', state: 'Rajasthan', region: 'North', category: 'college', character: 'Theory', summary: 'Theoretical nuclear-structure and decay research using relativistic mean-field approaches.', researchAreas: ['Nuclear Structure', 'Nuclear Theory', 'Nuclear Decay & Isomers', 'Nuclear Astrophysics'], researchers: [{ id: 'rj02-gaurav-saxena', name: 'Dr Gaurav Saxena' }], coordinates: { latitude: 26.45, longitude: 74.64 }, verificationStatus: 'verified-v1', lastVerified: '2026-09',
  },
] as const

export function getInstitutionCategoryLabel(category: InstitutionCategory): string {
  return institutionCategories.find(item => item.id === category)?.label ?? category
}
