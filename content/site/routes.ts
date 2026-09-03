import { bulletinContentNotice, bulletinSources, currentLeadership, publicContact } from './bulletin-sources'

export interface RouteSection {
  id?: string
  heading: string
  paragraphs?: readonly string[]
  items?: readonly string[]
}

export interface PendingRouteContent {
  title: string
  eyebrow: string
  description: string
  indexable?: boolean
  requiredContent?: string
  sourceNote?: string
  sections?: readonly RouteSection[]
}

export const pendingRoutes: Record<string, PendingRouteContent> = {
  '/about': {
    title: 'About INPA',
    eyebrow: 'Institutional profile',
    description: 'The Indian Nuclear Physics Association is a scientific society and national platform for India’s nuclear-physics community.',
    indexable: true,
    requiredContent: 'A final institutionally approved About statement, office address and full governance documents are still required.',
    sourceNote: bulletinContentNotice,
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
        items: [
          'Promote fundamental and applied nuclear research.',
          'Strengthen collaboration across universities, national laboratories, industry and policymakers.',
          'Support education, laboratory training, mentorship and educational resources.',
          'Improve awareness of nuclear science and its applications among students, educators and the public.',
        ],
      },
    ],
  },
  '/about/presidents-message': {
    title: 'President’s message',
    eyebrow: 'Office of the President',
    description: currentLeadership.president.name + ' is President of the Indian Nuclear Physics Association and Professor at ' + currentLeadership.president.affiliation + '.',
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
    title: 'Executive leadership',
    eyebrow: 'INPA leadership',
    description: 'A current leadership snapshot for the Indian Nuclear Physics Association (' + currentLeadership.asOf + ').',
    requiredContent: 'The complete council roster, role terms, approved biographies, portraits and future-change process still require confirmation before launch.',
    sourceNote: bulletinContentNotice,
    sections: [
      {
        heading: 'Leadership snapshot — ' + currentLeadership.asOf,
        items: [
          'President: ' + currentLeadership.president.name + ' — ' + currentLeadership.president.affiliation,
          'Executive Secretary: ' + currentLeadership.executiveSecretary.name + ' — ' + currentLeadership.executiveSecretary.affiliation,
          'Chief Editor, Nuclear Horizons: ' + currentLeadership.chiefEditor.name + ' — ' + currentLeadership.chiefEditor.affiliation,
        ],
      },
    ],
  },
  '/about/committees': {
    title: 'Committees and governance',
    eyebrow: 'Association governance',
    description: 'A dedicated home for INPA leadership, committees and governance documents.',
    requiredContent: 'The complete approved committee structure, committee membership, terms of reference and current terms of office are still required.',
    sourceNote: bulletinContentNotice,
    sections: [
      {
        heading: 'Currently verified leadership snapshot — ' + currentLeadership.asOf,
        items: [
          'President: ' + currentLeadership.president.name + ' — ' + currentLeadership.president.affiliation,
          'Executive Secretary: ' + currentLeadership.executiveSecretary.name + ' — ' + currentLeadership.executiveSecretary.affiliation,
          'Chief Editor, Nuclear Horizons: ' + currentLeadership.chiefEditor.name + ' — ' + currentLeadership.chiefEditor.affiliation,
        ],
      },
      {
        heading: 'Governance information to be published here',
        items: [
          'Executive Council roster and terms.',
          'Approved committees and their responsibilities.',
          'Committee membership and contact routes.',
          'Constitution and approved governance documents.',
        ],
      },
    ],
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
    eyebrow: 'Developing national framework',
    description: 'A community-driven framework for transforming India’s nuclear-physics aspirations into coordinated national action.',
    requiredContent: 'NNPI has not yet been formally announced. Its approved public document, framework figure, scope owners and publication date are required before this page can be treated as a launched programme.',
    sourceNote: 'Framework wording and structure supplied by the INPA President in website comments received in August 2026.',
    sections: [
      {
        heading: 'A Community Action Framework for Realizing the Mega Science Vision–2035',
        paragraphs: [
          'The developing NNPI concept is intended to connect scientific priorities, national capability and community coordination. This page records the proposed framing without presenting it as a formally launched initiative.',
        ],
      },
      {
        heading: 'Three connected elements',
        items: [
          'Science — frontier questions and national priorities.',
          'Capability — theory, experiment, instrumentation, computing and facilities.',
          'Community — collaboration, young researchers and national coordination.',
        ],
      },
    ],
  },
  '/nuclear-horizons': {
    title: 'Nuclear Horizons',
    eyebrow: 'INPA publication',
    description: 'Nuclear Horizons is the official bulletin of the Indian Nuclear Physics Association and a platform for communication, collaboration and knowledge exchange.',
    indexable: true,
    requiredContent: 'Author and submission guidance will be added when the editorial route is supplied.',
    sections: [
      {
        heading: 'Publication information',
        items: [
          'Chief Editor as published in Issue 2: ' + currentLeadership.chiefEditor.name + ', ' + currentLeadership.chiefEditor.affiliation + '.',
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
    eyebrow: 'Publication archive',
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
    eyebrow: 'Learn and progress',
    description: 'The bulletins identify young-researcher articles, thesis summaries and a monthly INPA Young Scientist Colloquium as developing community activities.',
    requiredContent: 'Verified programme pages, schedules, registration destinations, responsible owners and last-reviewed dates are still required.',
    sourceNote: bulletinContentNotice,
    sections: [
      {
        heading: 'Resource areas prepared for verified material',
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
    eyebrow: 'Current opportunities',
    description: 'This route will separate current opportunities from expired listings.',
    requiredContent: 'Verified opportunity owners, deadlines, destinations and review dates are required.',
  },
  '/people': {
    title: 'Distinguished scientists',
    eyebrow: 'Curated profiles',
    description: 'This route is prepared for verified pioneer and contemporary-scientist profiles.',
    requiredContent: 'Approved biographies, photographs, affiliations, dates, achievements, selection criteria and credits are required.',
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
    description: 'Nuclear Horizons, Volume 1, Issue 2 reports that more than 500 colleagues had joined the INPA community by June 2026.',
    requiredContent: 'Application instructions, eligibility details, membership duration, renewal terms and the approved payment route will be added after confirmation. No online payment is currently offered through this website.',
    sourceNote: 'Membership amounts supplied by the INPA President in project correspondence. Application and payment procedures remain to be confirmed.',
    sections: [
      {
        heading: 'Membership categories and amounts',
        items: [
          'Annual membership: ₹1,000.',
          'Life membership: ₹6,000 or above.',
          'Donor membership: above ₹21,000.',
          'Institutional membership: amount not yet decided.',
        ],
      },
    ],
  },
  '/contact': {
    title: 'Contact INPA',
    eyebrow: 'Contact',
    description: 'Public contact details approved by the INPA President on 10 August 2026.',
    indexable: true,
    requiredContent: publicContact.missing,
    sourceNote: publicContact.source,
    sections: [
      {
        id: 'contact-details',
        heading: 'INPA office',
        items: [
          publicContact.address,
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
    eyebrow: 'Privacy',
    description: 'How the current INPA website handles information and third-party services.',
    requiredContent: 'This notice describes the present website. It should be reviewed by INPA whenever forms, analytics, payments, newsletters or other data-collection features are introduced.',
    sourceNote: 'Last updated: 3 September 2026.',
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
