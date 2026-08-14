import { bulletinContentNotice, bulletinSources, currentLeadership, publicContact } from './bulletin-sources'

export interface RouteSection {
  heading: string
  paragraphs?: readonly string[]
  items?: readonly string[]
}

export interface PendingRouteContent {
  title: string
  eyebrow: string
  description: string
  requiredContent: string
  sourceNote?: string
  sections?: readonly RouteSection[]
}

export const pendingRoutes: Record<string, PendingRouteContent> = {
  '/about': {
    title: 'About INPA',
    eyebrow: 'Institutional profile',
    description: 'The Indian Nuclear Physics Association is a scientific society and national platform for India’s nuclear-physics community.',
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
    description: currentLeadership.president.name + ', ' + currentLeadership.president.affiliation + ', is listed as President of INPA in Nuclear Horizons, Volume 1, Issue 2 (' + currentLeadership.asOf + ').',
    requiredContent: 'The portrait has been supplied. A formal photograph credit and final author-approved web version of the full message are still required.',
    sourceNote: bulletinContentNotice,
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
    description: 'Selected current roles as published in Nuclear Horizons, Volume 1, Issue 2 (' + currentLeadership.asOf + ').',
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
    description: 'A source-backed feature from Nuclear Horizons, Volume 1, Issue 2.',
    requiredContent: 'Web-publication approval, canonical references and permission for any article figures are still required before reproducing the complete article.',
    sourceNote: bulletinContentNotice,
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
    requiredContent: 'Written web-distribution permission, approved cover files, accessible PDFs, article links and a submission route are still required.',
    sourceNote: bulletinContentNotice,
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
        heading: 'Available issue metadata',
        items: bulletinSources.map(issue => issue.issueLabel + ' — ' + issue.publicationDate),
      },
    ],
  },
  '/nuclear-horizons/archive': {
    title: 'Nuclear Horizons archive',
    eyebrow: 'Publication archive',
    description: 'Issue metadata verified from the two supplied Nuclear Horizons publications.',
    requiredContent: 'The PDFs and cover artwork will remain unavailable on the website until INPA confirms web-distribution permission.',
    sourceNote: bulletinContentNotice,
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
    requiredContent: 'The approved membership process, eligibility, fees and application destination are required.',
    sourceNote: bulletinContentNotice,
  },
  '/contact': {
    title: 'Contact INPA',
    eyebrow: 'Contact',
    description: 'Public contact details approved by the INPA President on 10 August 2026.',
    requiredContent: publicContact.missing,
    sourceNote: publicContact.source,
    sections: [
      {
        heading: 'INPA office',
        items: [
          publicContact.address,
          'Secretary: ' + publicContact.secretary,
          'Telephone: ' + publicContact.phoneDisplay,
          'Email: ' + publicContact.email,
        ],
      },
    ],
  },
  '/privacy': {
    title: 'Privacy Policy',
    eyebrow: 'Privacy',
    description: 'The current foundation collects no public personal data and uses no advertising or invasive analytics.',
    requiredContent: 'A formally reviewed privacy policy and responsible contact are required before launch.',
  },
}
