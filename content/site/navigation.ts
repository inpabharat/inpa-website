import { presidentContent } from './president'
import { isPublicPathVisible } from './visibility'

export interface NavigationLink {
  label: string
  to: string
  description: string
  status?: string
}

export interface NavigationGroup {
  id: string
  label: string
  description: string
  links: readonly NavigationLink[]
}

const allNavigationGroups: readonly NavigationGroup[] = [
  {
    id: 'about',
    label: 'About',
    description: 'INPA’s purpose, leadership and governance.',
    links: [
      { label: 'About INPA', to: '/about', description: 'Formation, registration and published objectives.' },
      { label: presidentContent.title, to: presidentContent.to, description: `${presidentContent.name} on INPA’s priorities.` },
      { label: 'Executive Council', to: '/about/executive-council', description: 'Office bearers and council members.' },
      { label: 'Advisory Committee', to: '/about/committees', description: 'Committee members and their role in guiding INPA.' },
      { label: 'Contact INPA', to: '/contact', description: 'Office address, phone and email.' },
    ],
  },
  {
    id: 'science',
    label: 'Science',
    description: 'Research, national initiatives and scientific institutions.',
    links: [
      { label: 'NNPI Framework', to: '/nnpi', description: 'From vision to coordinated national action.' },
      { label: 'Featured Research', to: '/research', description: 'Curated Indian nuclear-physics research.' },
      { label: 'Nuclear Physics in India', to: '/map', description: 'Explore India’s nuclear-physics institutions, research groups, people and experimental facilities.' },
      { label: 'Distinguished Scientists', to: '/people', description: 'Profiles of pioneers and contemporary researchers.' },
    ],
  },
  {
    id: 'updates',
    label: 'News & Events',
    description: 'Announcements, dates and established scientific programmes.',
    links: [
      { label: 'News Archive', to: '/news', description: 'Announcements from across INPA.' },
      { label: 'Events Archive', to: '/events', description: 'Upcoming events and records of past programmes.' },
      { label: 'Young Scientist Colloquium', to: '/activities/young-scientist-colloquium', description: 'Seminar records and how to apply to speak.' },
    ],
  },
  {
    id: 'publications',
    label: 'Publications',
    description: 'INPA publications and verified issue records.',
    links: [
      { label: 'Nuclear Horizons', to: '/nuclear-horizons', description: 'The official bulletin of INPA.' },
      { label: 'Issue Archive', to: '/nuclear-horizons/archive', description: 'Browse and download issues of Nuclear Horizons.' },
    ],
  },
  {
    id: 'students',
    label: 'Students',
    description: 'Learning resources and verified opportunities.',
    links: [
      { label: 'Student Resources', to: '/students', description: 'Lectures, schools and career guidance.' },
      { label: 'Student Opportunities', to: '/students/opportunities', description: 'Opportunities for students and early-career researchers.' },
    ],
  },
  {
    id: 'community',
    label: 'Community',
    description: 'Participation, recognition and community activity.',
    links: [
      { label: 'Community Highlights', to: '/community', description: 'Stories and photographs from INPA gatherings.' },
      { label: 'Membership', to: '/membership', description: 'Membership categories, fees and payment details.' },
      { label: 'Awards and Recognition', to: '/awards', description: 'INPA award announcements.' },
      { label: 'Jobs', to: '/jobs', description: 'Employment listings in nuclear physics.' },
    ],
  },
] as const

export const navigationGroups = allNavigationGroups
  .map(group => ({ ...group, links: group.links.filter(link => isPublicPathVisible(link.to)) }))
  .filter(group => group.links.length > 0)

export const utilityNavigation: readonly Pick<NavigationLink, 'label' | 'to'>[] = [
  { label: 'Contact', to: '/contact' },
  { label: 'Privacy', to: '/privacy' },
  { label: 'Accessibility', to: '/contact#accessibility' },
  { label: 'Sitemap', to: '/sitemap.xml' },
  { label: 'Report a correction', to: '/contact#corrections' },
] as const

export const publicNavigationDestinations = [
  ...navigationGroups.flatMap(group => group.links.map(link => link.to)),
  ...utilityNavigation.map(link => link.to),
] as const
