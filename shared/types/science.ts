export const scienceStatuses = ['draft', 'published', 'archived'] as const
export type ScienceStatus = (typeof scienceStatuses)[number]

export interface PublicationInput {
  slug: string
  title: string
  volume: number
  issueNumber: number
  issueLabel: string
  publicationDate: string
  summary: string
  editorial: string
  featuredReview: string
  pdfKey: string
  coverImageKey: string
  coverImageAlt: string
  pageCount: number
  status: ScienceStatus
}

export interface ResearchInput {
  slug: string
  title: string
  summary: string
  body: string
  authors: string
  institutions: string
  journal: string
  doi: string
  imageKey: string | null
  imageAlt: string | null
  imageCredit: string | null
  status: ScienceStatus
  isFeatured: boolean
  publishedAt: string
}

export interface ScienceRecordMeta {
  id: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}

export type PublicationRecord = PublicationInput & ScienceRecordMeta
export type ResearchRecord = ResearchInput & ScienceRecordMeta

export type PublicPublication = PublicationInput & { id: string }
export type PublicResearch = ResearchInput & { id: string }

export interface ScienceMediaUsage {
  kind: 'publication' | 'research'
  id: string
  title: string
  status: ScienceStatus
}
