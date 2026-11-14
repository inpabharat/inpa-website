import { bulletinSources, currentLeadership, publicContact } from './bulletin-sources'
import { advisoryCommitteeMembers, executiveCouncilSections } from './committees'
import { isPublicPathVisible } from './visibility'

export interface RouteSection {
  id?: string
  heading: string
  paragraphs?: readonly string[]
  address?: typeof publicContact.address
  items?: readonly string[]
  ordered?: boolean
}

export interface PendingRouteContent {
  title: string
  description: string
  indexable?: boolean
  requiredContent?: string
  lastUpdated?: string
  sections?: readonly RouteSection[]
}

const routeContent: Record<string, PendingRouteContent> = {
  '/about': {
    title: 'About INPA',
    description: 'The Indian Nuclear Physics Association is a scientific society and national platform for India’s nuclear-physics community.',
    indexable: true,
    sections: [
      {
        heading: 'Formation and registration',
        paragraphs: [
          'A national online meeting held on 5 November 2025 brought together more than one hundred members of the nuclear-physics community and advanced the formation of INPA.',
          'INPA received its certificate of registration as a society on 2 May 2026. The published registration number is VAR/00818/2026-27.',
        ],
      },
      {
        heading: 'Published objectives',
        ordered: true,
        items: [
          'Advance theoretical and experimental research in nuclear physics in India.',
          'Provide a common platform for collaboration among researchers, scientists, and educators.',
          'Organise national and international conferences, webinars, and seminars from time to time.',
          'Provide mentorship and guidance to students pursuing careers in nuclear science.',
          'Publish journals and research papers in nuclear physics.',
          'Recognise scientists and students for outstanding research and innovation through medals, fellowships, and cash awards.',
          'Promote the safe and peaceful use of nuclear energy in medicine, including cancer treatment, as well as in agriculture and power generation.',
          'Foster collaboration among institutions to enable shared use of the country’s major nuclear reactors and accelerators.',
          'Recommend updates to university physics curricula to keep pace with advances in technology.',
          'Facilitate collaboration between Indian scientists and international nuclear research centres such as CERN and JINR.',
          'Correct public misconceptions about nuclear radiation and energy and promote scientific awareness.',
          'Provide technical advice to the government and relevant bodies on nuclear policy and the development of science.',
        ],
      },
      {
        heading: 'INPA office',
        address: publicContact.address,
      },
    ],
  },
  '/about/presidents-message': {
    title: 'President’s message',
    description: currentLeadership.president.name + ' is President of the Indian Nuclear Physics Association.',
    sections: [
      {
        heading: 'Message summary',
        paragraphs: [
          'The President describes INPA as a connected national community with a shared responsibility to strengthen nuclear physics in India.',
          'The published priorities include scientific collaboration, educational resources, laboratory courses, mentorship for younger researchers and public awareness of nuclear science and its applications.',
        ],
      },
    ],
  },
  '/about/executive-council': {
    title: 'Executive Council',
    description: 'Office bearers, Executive Committee members and Council Members of the Indian Nuclear Physics Association.',
    sections: executiveCouncilSections,
  },
  '/about/committees': {
    title: 'Advisory Committee',
    description: 'The Advisory Committee provides strategic guidance to the Indian Nuclear Physics Association.',
    sections: [
      {
        heading: 'Role of the committee',
        paragraphs: [
          'The Advisory Committee brings together scientists and academics who have contributed to the advancement of nuclear physics in India. It helps shape INPA’s vision, activities and long-term roadmap.',
          'The committee advises INPA on emerging research directions, national and international collaborations, capacity building and outreach in line with Vision-2035 for Nuclear Science and Technology.',
        ],
      },
      {
        heading: 'Members',
        ordered: true,
        items: advisoryCommitteeMembers,
      },
    ],
  },
  '/research': {
    title: 'Featured research',
    description: 'A featured article from Nuclear Horizons, Volume 1, Issue 2.',
    requiredContent: 'The complete article, including its references and figures, can be read in the downloadable June 2026 issue of Nuclear Horizons.',
    sections: [
      {
        heading: 'Nuclear Structure Studies: From Fundamental Symmetries to Exotic Nuclei',
        paragraphs: [
          'Authors: Bijay Kumar Agrawal, Nisha Chandnani and Gaurav Saxena.',
          'Affiliations published with the article: Saha Institute of Nuclear Physics; Manipal University Jaipur; and Government Women Engineering College, Ajmer.',
          'The article explains how rotational, isospin, gauge and discrete symmetries guide conservation laws, nuclear models and investigations of nuclear structure, including nuclei far from stability.',
        ],
      },
    ],
  },
  '/nnpi': {
    title: 'NNPI — From Vision to Action',
    description: 'A community-driven framework for transforming India’s nuclear-physics aspirations into coordinated national action.',
    sections: [
      {
        heading: 'A Community Action Framework for Realizing the Mega Science Vision–2035',
        paragraphs: [
          'NNPI connects scientific priorities with present and future national capabilities and the nuclear-physics community, creating the road from shared vision to coordinated action.',
        ],
      },
      {
        heading: 'Three connected elements',
        items: [
          'Science — frontier questions and national priorities.',
          'Capability — theory, experiment, instrumentation, computing and facilities.',
          'Community — collaboration, young researchers and national coordination.',
          'Action — coordinated programmes, partnerships and implementation.',
        ],
      },
    ],
  },
  '/nuclear-horizons': {
    title: 'Nuclear Horizons',
    description: 'Nuclear Horizons is the official bulletin of the Indian Nuclear Physics Association and a platform for communication, collaboration and knowledge exchange.',
    indexable: true,
    requiredContent: 'Author and submission guidance will be added when the editorial route is supplied.',
    sections: [
      {
        heading: 'Publication information',
        items: [
          'Editor-in-Chief: ' + currentLeadership.editorInChief.name + ', ' + currentLeadership.editorInChief.title + ', ' + currentLeadership.editorInChief.department + ', ' + currentLeadership.editorInChief.affiliation + ', ' + currentLeadership.editorInChief.address + '. Email: ' + currentLeadership.editorInChief.email + '.',
          'Publication contact: ' + publicContact.email + '.',
          'Tagline: Advancing Fundamental and Applied Nuclear Science for a Self-Reliant India.',
        ],
      },
      {
        heading: 'Available issues',
        items: bulletinSources.map(issue => issue.issueLabel + ' — ' + issue.publicationDate),
      },
    ],
  },
  '/nuclear-horizons/archive': {
    title: 'Nuclear Horizons archive',
    description: 'Read or download published issues of Nuclear Horizons.',
    indexable: true,
    requiredContent: 'New issues will be added to this archive as they are published.',
    sections: [
      {
        heading: 'Volume 1',
        items: bulletinSources.map(issue => issue.issueLabel + ' — ' + issue.publicationDate),
      },
    ],
  },
  '/students': {
    title: 'Resources for students',
    description: 'Learning and career resources for students and early-career researchers in nuclear physics.',
    sections: [
      {
        heading: 'Resource topics',
        items: [
          'Lecture notes.',
          'Recorded lectures.',
          'PhD opportunities.',
          'Summer schools.',
          'Fellowships.',
          'Career guidance.',
          'Frequently asked questions.',
        ],
      },
    ],
  },
  '/students/opportunities': {
    title: 'Student opportunities',
    description: 'There are currently no student opportunity listings.',
  },
  '/people': {
    title: 'Distinguished scientists',
    description: 'Scientist profiles are currently unavailable.',
  },
  '/awards': {
    title: 'Awards',
    description: 'There are currently no award announcements.',
  },
  '/jobs': {
    title: 'Jobs',
    description: 'There are currently no job listings.',
  },
  '/contact': {
    title: 'Contact INPA',
    description: 'Contact the Indian Nuclear Physics Association by phone or email.',
    indexable: true,
    sections: [
      {
        id: 'contact-details',
        heading: 'INPA office',
        address: publicContact.address,
        items: [
          'Secretary: ' + publicContact.secretary,
          'Telephone: ' + publicContact.phoneDisplay,
          'Email: ' + publicContact.email,
        ],
      },
      {
        id: 'corrections',
        heading: 'Content corrections',
        paragraphs: [
          'To report an error or request a correction, write to ' + publicContact.email + ' with the page address and the information that should be reviewed.',
        ],
      },
      {
        id: 'accessibility',
        heading: 'Accessibility assistance',
        paragraphs: [
          'If any website content or document is difficult to access, contact ' + publicContact.email + ' and describe the page, document or format required.',
        ],
      },
    ],
  },
  '/privacy': {
    title: 'Privacy Policy',
    description: 'How the current INPA website handles information and third-party services.',
    lastUpdated: '3 September 2026',
    sections: [
      {
        heading: 'Information collected through the public website',
        paragraphs: [
          'The website currently has no public account system, payment facility, newsletter form or general contact form. It does not intentionally collect personal information directly from public visitors.',
          'Like other websites, the hosting and security infrastructure may process technical request information needed to deliver and protect the service.',
        ],
      },
      {
        heading: 'Cookies and analytics',
        paragraphs: [
          'The public website does not currently use advertising trackers or behavioural advertising. If privacy-respecting analytics are enabled later, this notice will be updated before their use.',
        ],
      },
      {
        heading: 'External links and documents',
        paragraphs: [
          'Links to external organisations, forms or publications are governed by those services’ own privacy practices. Visitors should review the destination before submitting personal information.',
        ],
      },
      {
        heading: 'Privacy questions',
        paragraphs: [
          'Questions about this notice or the handling of website information may be sent to ' + publicContact.email + '.',
        ],
      },
    ],
  },
}

export const pendingRoutes = Object.fromEntries(
  Object.entries(routeContent).filter(([path]) => isPublicPathVisible(path)),
)
