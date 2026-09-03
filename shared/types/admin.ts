import type { EventStatus, LinkedContentType, NewsStatus } from './content'

export interface AdminNewsInput {
  slug: string
  title: string
  summary: string
  body: string
  coverImageKey: string | null
  coverImageAlt: string | null
  category: string | null
  status: NewsStatus
  isFeatured: boolean
  publishAt: string | null
  publishedAt: string | null
  expiresAt: string | null
  externalUrl: string | null
}

export interface AdminEventInput {
  slug: string
  title: string
  summary: string
  body: string
  startAt: string
  endAt: string | null
  timezone: string
  locationName: string | null
  isOnline: boolean
  externalUrl: string | null
  coverImageKey: string | null
  coverImageAlt: string | null
  status: EventStatus
  isFeatured: boolean
  publishAt: string | null
}

export interface AdminCarouselInput {
  eyebrow: string | null
  title: string
  summary: string | null
  imageKey: string
  imageAlt: string
  ctaLabel: string | null
  ctaUrl: string | null
  linkedContentType: LinkedContentType | null
  linkedContentId: string | null
  sortOrder: number
  isActive: boolean
  startsAt: string | null
  endsAt: string | null
}

export interface AdminRecordMeta {
  id: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}

export type AdminNewsRecord = AdminNewsInput & AdminRecordMeta
export type AdminEventRecord = AdminEventInput & AdminRecordMeta
export type AdminCarouselRecord = AdminCarouselInput & AdminRecordMeta

export interface AdminContentSnapshot {
  news: AdminNewsRecord[]
  events: AdminEventRecord[]
  carousel: AdminCarouselRecord[]
}

export interface AdminApiResponse<T> {
  data: T
  meta: {
    generatedAt: string
  }
}

export interface AdminMutationResponse<T> extends AdminApiResponse<T> {
  message: string
}

