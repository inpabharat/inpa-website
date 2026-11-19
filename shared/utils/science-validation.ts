import type { PublicationInput, ResearchInput } from '../types/science'
import { scienceStatuses } from '../types/science'

export class ScienceValidationError extends Error {
  constructor(readonly issues: string[], readonly fieldIssues: Record<string, string> = {}) {
    super(issues.join(' '))
    this.name = 'ScienceValidationError'
  }
}

function fieldError(key: string, message: string): ScienceValidationError {
  return new ScienceValidationError([message], { [key]: message })
}

function requirePublishedFields(fields: [key: string, label: string, value: string][]): void {
  const fieldIssues = Object.fromEntries(fields
    .filter(([, , value]) => !value)
    .map(([key, label]) => [key, `${label} is required before publishing.`]))
  const issues = Object.values(fieldIssues)
  if (issues.length) throw new ScienceValidationError(issues, fieldIssues)
}

function recordOf(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new ScienceValidationError(['A content object is required.'])
  }
  return input as Record<string, unknown>
}

function requiredText(record: Record<string, unknown>, key: string, label: string, max: number): string {
  const value = typeof record[key] === 'string' ? record[key].trim() : ''
  if (!value) throw fieldError(key, `${label} is required.`)
  if (value.length > max) throw fieldError(key, `${label} must be ${max} characters or fewer.`)
  return value
}

function draftText(record: Record<string, unknown>, key: string, label: string, max: number): string {
  return optionalText(record, key, label, max) ?? ''
}

function optionalText(record: Record<string, unknown>, key: string, label: string, max: number): string | null {
  const raw = record[key]
  if (raw === null || raw === undefined || raw === '') return null
  if (typeof raw !== 'string') throw fieldError(key, `${label} must be text.`)
  const value = raw.trim()
  if (!value) return null
  if (value.length > max) throw fieldError(key, `${label} must be ${max} characters or fewer.`)
  return value
}

function wholeNumber(record: Record<string, unknown>, key: string, label: string, min: number, max: number): number {
  const value = record[key]
  if (!Number.isInteger(value) || (value as number) < min || (value as number) > max) {
    throw fieldError(key, `${label} must be a whole number from ${min} to ${max}.`)
  }
  return value as number
}

function booleanValue(record: Record<string, unknown>, key: string, label: string): boolean {
  if (typeof record[key] !== 'boolean') throw fieldError(key, `${label} must be true or false.`)
  return record[key]
}

function slugValue(record: Record<string, unknown>): string {
  const slug = requiredText(record, 'slug', 'Slug', 120).toLowerCase()
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw fieldError('slug', 'Slug may contain lowercase letters, numbers, and single hyphens only.')
  }
  return slug
}

function statusValue(record: Record<string, unknown>) {
  const value = record.status
  if (typeof value !== 'string' || !scienceStatuses.includes(value as typeof scienceStatuses[number])) {
    throw fieldError('status', 'Publication status is not recognised.')
  }
  return value as typeof scienceStatuses[number]
}

function calendarDate(record: Record<string, unknown>, key: string, label: string, required: boolean): string {
  const value = draftText(record, key, label, 10)
  if (!value && !required) return ''
  if (!value) throw fieldError(key, `${label} is required before publishing.`)
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) throw fieldError(key, `${label} must use YYYY-MM-DD.`)
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(Date.UTC(year, month - 1, day))
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    throw fieldError(key, `${label} must be a real calendar date.`)
  }
  return value
}

function doiValue(record: Record<string, unknown>, required: boolean): string {
  let value = draftText(record, 'doi', 'DOI', 500)
  if (!value && !required) return ''
  if (!value) throw fieldError('doi', 'DOI is required before publishing.')
  value = value.replace(/^doi:\s*/i, '').replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, '')
  if (!/^10\.\d{4,9}\/[\w.()/:;+-]+$/i.test(value)) {
    throw fieldError('doi', 'DOI must be a valid DOI such as 10.1234/example.')
  }
  return `https://doi.org/${value}`
}

function validateResearchImage(imageKey: string | null, imageAlt: string | null, imageCredit: string | null): void {
  if (imageKey && (!imageAlt || !imageCredit)) {
    throw fieldError(imageAlt ? 'imageCredit' : 'imageAlt', 'Image description and credit are required when a research image is selected.')
  }
  if (!imageKey && (imageAlt || imageCredit)) {
    throw fieldError('imageKey', 'Select a research image before adding its description or credit.')
  }
}

export function parsePublicationInput(input: unknown): PublicationInput {
  const record = recordOf(input)
  const status = statusValue(record)
  const isPublished = status === 'published'
  const parsed = {
    slug: slugValue(record),
    title: requiredText(record, 'title', 'Publication title', 180),
    volume: wholeNumber(record, 'volume', 'Volume', 1, 10_000),
    issueNumber: wholeNumber(record, 'issueNumber', 'Issue number', 1, 10_000),
    issueLabel: draftText(record, 'issueLabel', 'Issue label', 180),
    publicationDate: calendarDate(record, 'publicationDate', 'Publication date', isPublished),
    summary: draftText(record, 'summary', 'Issue summary', 1_000),
    editorial: draftText(record, 'editorial', 'Editorial', 50_000),
    featuredReview: draftText(record, 'featuredReview', 'Featured review', 10_000),
    pdfKey: draftText(record, 'pdfKey', 'Bulletin PDF', 500),
    coverImageKey: draftText(record, 'coverImageKey', 'Cover image', 500),
    coverImageAlt: draftText(record, 'coverImageAlt', 'Cover image description', 300),
    pageCount: wholeNumber(record, 'pageCount', 'Page count', isPublished ? 1 : 0, 100_000),
    status,
  }
  if (isPublished) {
    requirePublishedFields([
      ['issueLabel', 'Issue label', parsed.issueLabel],
      ['pdfKey', 'Bulletin PDF', parsed.pdfKey],
      ['coverImageKey', 'Cover image', parsed.coverImageKey],
      ['coverImageAlt', 'Cover image description', parsed.coverImageAlt],
    ])
  }
  if ((parsed.coverImageKey && !parsed.coverImageAlt) || (!parsed.coverImageKey && parsed.coverImageAlt)) {
    throw fieldError(parsed.coverImageKey ? 'coverImageAlt' : 'coverImageKey', 'Cover image and its description must be supplied together.')
  }
  return parsed
}

export function parseResearchInput(input: unknown): ResearchInput {
  const record = recordOf(input)
  const status = statusValue(record)
  const isPublished = status === 'published'
  const imageKey = optionalText(record, 'imageKey', 'Research image', 500)
  const imageAlt = optionalText(record, 'imageAlt', 'Research image description', 300)
  const imageCredit = optionalText(record, 'imageCredit', 'Research image credit', 500)
  validateResearchImage(imageKey, imageAlt, imageCredit)

  const parsed = {
    slug: slugValue(record),
    title: requiredText(record, 'title', 'Research title', 240),
    summary: draftText(record, 'summary', 'Research summary', 1_000),
    body: draftText(record, 'body', 'Research article', 50_000),
    authors: draftText(record, 'authors', 'Authors', 2_000),
    institutions: draftText(record, 'institutions', 'Institutions', 2_000),
    journal: draftText(record, 'journal', 'Journal', 500),
    doi: doiValue(record, isPublished),
    imageKey,
    imageAlt,
    imageCredit,
    status,
    isFeatured: booleanValue(record, 'isFeatured', 'Featured setting'),
    publishedAt: calendarDate(record, 'publishedAt', 'Publication date', isPublished),
  }
  if (isPublished) {
    requirePublishedFields([
      ['summary', 'Research summary', parsed.summary],
      ['body', 'Research article', parsed.body],
      ['authors', 'Authors', parsed.authors],
      ['institutions', 'Institutions', parsed.institutions],
      ['journal', 'Journal', parsed.journal],
    ])
  }
  return parsed
}
