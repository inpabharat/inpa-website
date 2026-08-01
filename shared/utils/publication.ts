import type { EventStatus, NewsStatus } from '../types/content'

interface NewsPublicationInput {
  status: NewsStatus
  publishAt: string | null
  publishedAt: string | null
  expiresAt: string | null
}

interface EventPublicationInput {
  status: EventStatus
  publishAt: string | null
  startAt: string
}

function isAtOrBefore(value: string, now: Date): boolean {
  return Date.parse(value) <= now.getTime()
}

export function isNewsPublic(item: NewsPublicationInput, now = new Date()): boolean {
  if (item.status !== 'published') return false
  const effectivePublishAt = item.publishedAt ?? item.publishAt
  if (!effectivePublishAt || !isAtOrBefore(effectivePublishAt, now)) return false
  return item.expiresAt === null || Date.parse(item.expiresAt) > now.getTime()
}

export function isEventPublic(item: EventPublicationInput, now = new Date()): boolean {
  if (!['published', 'postponed', 'cancelled'].includes(item.status)) return false
  return item.publishAt === null || isAtOrBefore(item.publishAt, now)
}

export function isUpcomingEvent(startAt: string, now = new Date()): boolean {
  return Date.parse(startAt) >= now.getTime()
}
