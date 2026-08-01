export const newsStatuses = ['draft', 'scheduled', 'published', 'archived'] as const
export type NewsStatus = (typeof newsStatuses)[number]

export const eventStatuses = [
  'draft',
  'scheduled',
  'published',
  'postponed',
  'cancelled',
  'completed',
  'archived',
] as const
export type EventStatus = (typeof eventStatuses)[number]

export const linkedContentTypes = ['news', 'event', 'custom'] as const
export type LinkedContentType = (typeof linkedContentTypes)[number]

export interface PublicNewsItem {
  slug: string
  title: string
  summary: string
  publishedAt: string
  category: string | null
  coverImageKey: string | null
  coverImageAlt: string | null
  externalUrl: string | null
}

export interface PublicEventItem {
  slug: string
  title: string
  summary: string
  startAt: string
  endAt: string | null
  timezone: string
  locationName: string | null
  isOnline: boolean
  status: EventStatus
  externalUrl: string | null
}

export interface PublicCarouselItem {
  id: string
  eyebrow: string | null
  title: string
  summary: string | null
  imageKey: string
  imageAlt: string
  ctaLabel: string | null
  ctaUrl: string | null
  sortOrder: number
}

export interface PublicHomeData {
  news: PublicNewsItem[]
  events: PublicEventItem[]
  carousel: PublicCarouselItem[]
}

export interface ApiResponse<T> {
  data: T
  meta: {
    generatedAt: string
    source: 'd1' | 'development-placeholder' | 'unavailable'
  }
}
