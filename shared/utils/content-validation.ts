import type { AdminCarouselInput, AdminEventInput, AdminNewsInput } from '../types/admin'
import { eventStatuses, linkedContentTypes, newsStatuses } from '../types/content'

export class ContentValidationError extends Error {
  constructor(readonly issues: string[]) {
    super(issues.join(' '))
    this.name = 'ContentValidationError'
  }
}

function recordOf(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new ContentValidationError(['A content object is required.'])
  }
  return input as Record<string, unknown>
}

function requiredText(record: Record<string, unknown>, key: string, label: string, max: number): string {
  const value = typeof record[key] === 'string' ? record[key].trim() : ''
  if (!value) throw new ContentValidationError([`${label} is required.`])
  if (value.length > max) throw new ContentValidationError([`${label} must be ${max} characters or fewer.`])
  return value
}

function optionalText(record: Record<string, unknown>, key: string, label: string, max: number): string | null {
  const raw = record[key]
  if (raw === null || raw === undefined || raw === '') return null
  if (typeof raw !== 'string') throw new ContentValidationError([`${label} must be text.`])
  const value = raw.trim()
  if (!value) return null
  if (value.length > max) throw new ContentValidationError([`${label} must be ${max} characters or fewer.`])
  return value
}

function booleanValue(record: Record<string, unknown>, key: string): boolean {
  if (typeof record[key] !== 'boolean') throw new ContentValidationError([`${key} must be true or false.`])
  return record[key]
}

function isoDate(record: Record<string, unknown>, key: string, label: string, required = false): string | null {
  const value = optionalText(record, key, label, 64)
  if (!value) {
    if (required) throw new ContentValidationError([`${label} is required.`])
    return null
  }
  const timestamp = Date.parse(value)
  if (!Number.isFinite(timestamp)) throw new ContentValidationError([`${label} must be a valid date and time.`])
  return new Date(timestamp).toISOString()
}

function urlValue(record: Record<string, unknown>, key: string, label: string): string | null {
  const value = optionalText(record, key, label, 500)
  if (!value) return null
  if (value.startsWith('/') && !value.startsWith('//')) return value
  try {
    const parsed = new URL(value)
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') throw new Error('Unsupported protocol')
    return parsed.toString()
  } catch {
    throw new ContentValidationError([`${label} must be an HTTPS, HTTP, or site-relative URL.`])
  }
}

function slugValue(record: Record<string, unknown>): string {
  const slug = requiredText(record, 'slug', 'Slug', 120).toLowerCase()
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new ContentValidationError(['Slug may contain lowercase letters, numbers, and single hyphens only.'])
  }
  return slug
}

function enumValue<const T extends readonly string[]>(
  record: Record<string, unknown>,
  key: string,
  label: string,
  allowed: T,
): T[number] {
  const value = record[key]
  if (typeof value !== 'string' || !allowed.includes(value)) {
    throw new ContentValidationError([`${label} is not recognised.`])
  }
  return value as T[number]
}

function validateImagePair(key: string | null, alt: string | null): void {
  if ((key && !alt) || (!key && alt)) {
    throw new ContentValidationError(['Image key and alternative text must be supplied together.'])
  }
}

function validateOrder(first: string | null, second: string | null, message: string): void {
  if (first && second && Date.parse(second) < Date.parse(first)) {
    throw new ContentValidationError([message])
  }
}

export function makeSlug(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120)
}

export function parseNewsInput(input: unknown): AdminNewsInput {
  const record = recordOf(input)
  const coverImageKey = optionalText(record, 'coverImageKey', 'Cover image key', 500)
  const coverImageAlt = optionalText(record, 'coverImageAlt', 'Cover image alternative text', 300)
  validateImagePair(coverImageKey, coverImageAlt)
  const publishAt = isoDate(record, 'publishAt', 'Publication schedule')
  const publishedAt = isoDate(record, 'publishedAt', 'Published date')
  const expiresAt = isoDate(record, 'expiresAt', 'Expiry date')
  validateOrder(publishedAt ?? publishAt, expiresAt, 'Expiry date must be after publication.')
  const status = enumValue(record, 'status', 'News status', newsStatuses)
  if (status === 'scheduled' && !publishAt) {
    throw new ContentValidationError(['A scheduled news item requires a publication time.'])
  }

  return {
    slug: slugValue(record),
    title: requiredText(record, 'title', 'Title', 180),
    summary: requiredText(record, 'summary', 'Summary', 500),
    body: requiredText(record, 'body', 'Body', 50_000),
    coverImageKey,
    coverImageAlt,
    category: optionalText(record, 'category', 'Category', 80),
    status,
    isFeatured: booleanValue(record, 'isFeatured'),
    publishAt,
    publishedAt,
    expiresAt,
    externalUrl: urlValue(record, 'externalUrl', 'External URL'),
  }
}

export function parseEventInput(input: unknown): AdminEventInput {
  const record = recordOf(input)
  const startAt = isoDate(record, 'startAt', 'Start date', true) as string
  const endAt = isoDate(record, 'endAt', 'End date')
  validateOrder(startAt, endAt, 'End date must be after the start date.')
  const coverImageKey = optionalText(record, 'coverImageKey', 'Cover image key', 500)
  const coverImageAlt = optionalText(record, 'coverImageAlt', 'Cover image alternative text', 300)
  validateImagePair(coverImageKey, coverImageAlt)
  const status = enumValue(record, 'status', 'Event status', eventStatuses)
  const publishAt = isoDate(record, 'publishAt', 'Publication schedule')
  if (status === 'scheduled' && !publishAt) {
    throw new ContentValidationError(['A scheduled event requires a publication time.'])
  }

  return {
    slug: slugValue(record),
    title: requiredText(record, 'title', 'Title', 180),
    summary: requiredText(record, 'summary', 'Summary', 500),
    body: requiredText(record, 'body', 'Body', 50_000),
    startAt,
    endAt,
    timezone: requiredText(record, 'timezone', 'Timezone', 80),
    locationName: optionalText(record, 'locationName', 'Location', 180),
    isOnline: booleanValue(record, 'isOnline'),
    externalUrl: urlValue(record, 'externalUrl', 'External URL'),
    coverImageKey,
    coverImageAlt,
    status,
    isFeatured: booleanValue(record, 'isFeatured'),
    publishAt,
  }
}

export function parseCarouselInput(input: unknown): AdminCarouselInput {
  const record = recordOf(input)
  const startsAt = isoDate(record, 'startsAt', 'Start date')
  const endsAt = isoDate(record, 'endsAt', 'End date')
  validateOrder(startsAt, endsAt, 'End date must be after the start date.')
  const sortOrder = record.sortOrder
  if (!Number.isInteger(sortOrder) || (sortOrder as number) < 0 || (sortOrder as number) > 10_000) {
    throw new ContentValidationError(['Sort order must be a whole number from 0 to 10000.'])
  }
  const ctaLabel = optionalText(record, 'ctaLabel', 'Action label', 80)
  const ctaUrl = urlValue(record, 'ctaUrl', 'Action URL')
  if ((ctaLabel && !ctaUrl) || (!ctaLabel && ctaUrl)) {
    throw new ContentValidationError(['Action label and action URL must be supplied together.'])
  }
  const linkedContentType = record.linkedContentType === null || record.linkedContentType === ''
    ? null
    : enumValue(record, 'linkedContentType', 'Linked content type', linkedContentTypes)
  const linkedContentId = optionalText(record, 'linkedContentId', 'Linked content ID', 120)
  if ((linkedContentType && !linkedContentId) || (!linkedContentType && linkedContentId)) {
    throw new ContentValidationError(['Linked content type and ID must be supplied together.'])
  }

  return {
    eyebrow: optionalText(record, 'eyebrow', 'Eyebrow', 80),
    title: requiredText(record, 'title', 'Title', 180),
    summary: optionalText(record, 'summary', 'Summary', 500),
    imageKey: requiredText(record, 'imageKey', 'Image key', 500),
    imageAlt: requiredText(record, 'imageAlt', 'Image alternative text', 300),
    ctaLabel,
    ctaUrl,
    linkedContentType,
    linkedContentId,
    sortOrder: sortOrder as number,
    isActive: booleanValue(record, 'isActive'),
    startsAt,
    endsAt,
  }
}
