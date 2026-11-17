import type { H3Event } from 'h3'
import { createError, getHeader, getRequestURL, getRequestWebStream, isError, setResponseHeaders } from 'h3'
import { getCloudflareBindings } from '../database/bindings'
import { useDatabase } from '../database/client'
import { CandidatesRepository } from '../repositories/candidates.repository'

export async function withCandidates<T>(event: H3Event, operation: (repository: CandidatesRepository) => Promise<T>): Promise<T> {
  const database = useDatabase(event)
  if (!database) throw createError({ statusCode: 503, statusMessage: 'The directory is temporarily unavailable.' })
  try {
    return await operation(new CandidatesRepository(database))
  } catch (error) {
    if (isError(error)) throw error
    // Database errors may include bound personal data. Keep those out of responses and logs.
    throw createError({ statusCode: 503, statusMessage: 'The directory is temporarily unavailable.' })
  }
}

export function protectCandidateResponse(event: H3Event): void {
  setResponseHeaders(event, {
    'Cache-Control': 'private, no-store',
    'Referrer-Policy': 'no-referrer',
    'X-Robots-Tag': 'noindex, nofollow, noarchive',
  })
}

export async function limitCandidateRequests(event: H3Event, operation: 'browse' | 'submit' | 'manage'): Promise<void> {
  const bindings = getCloudflareBindings(event)
  const limiter = bindings?.CANDIDATE_RATE_LIMIT
  if (!limiter) {
    if (bindings?.INPA_ENVIRONMENT === 'local') return
    throw createError({ statusCode: 503, statusMessage: 'The directory is temporarily unavailable.' })
  }

  const address = getHeader(event, 'cf-connecting-ip') ?? 'shared'
  const result = await limiter.limit({ key: `${operation}:${address}`, delta: operation === 'submit' ? 12 : 1 })
  if (!result.success) {
    setResponseHeaders(event, { 'Retry-After': '60' })
    throw createError({ statusCode: 429, statusMessage: 'Too many requests. Please try again in a minute.' })
  }
}

export async function readCandidateJson(event: H3Event): Promise<Record<string, unknown>> {
  if (getHeader(event, 'origin') !== getRequestURL(event).origin) {
    throw createError({ statusCode: 403, statusMessage: 'Open the form on the INPA website to continue.' })
  }
  if (getHeader(event, 'content-type')?.split(';')[0]?.toLowerCase().trim() !== 'application/json') {
    throw createError({ statusCode: 415, statusMessage: 'The form must be submitted as JSON.' })
  }
  const maxBytes = 8192
  const tooLarge = () => createError({ statusCode: 413, statusMessage: 'This submission is too large.' })
  if (Number(getHeader(event, 'content-length')) > maxBytes) throw tooLarge()
  const reader = getRequestWebStream(event)?.getReader()
  if (!reader) throw createError({ statusCode: 400, statusMessage: 'The form submission is empty.' })

  const decoder = new TextDecoder()
  let bytes = 0
  let body = ''
  try {
    for (;;) {
      const chunk = await reader.read()
      if (chunk.done) break
      bytes += chunk.value.byteLength
      if (bytes > maxBytes) {
        await reader.cancel().catch(() => {})
        throw tooLarge()
      }
      body += decoder.decode(chunk.value, { stream: true })
    }
    body += decoder.decode()
  } finally {
    reader.releaseLock()
  }

  try {
    const parsed: unknown = JSON.parse(body)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed as Record<string, unknown>
  } catch {
    // Parsing errors are reported without echoing any submitted content.
  }
  throw createError({ statusCode: 400, statusMessage: 'The form could not be read.' })
}

export function candidatePage(value: unknown): number {
  const number = Number(value)
  return Number.isInteger(number) ? Math.min(1000, Math.max(1, number)) : 1
}

export function newCandidateToken(): string {
  return crypto.randomUUID().replaceAll('-', '') + crypto.randomUUID().replaceAll('-', '')
}

export async function hashCandidateToken(token: string): Promise<string> {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token))
  return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('')
}
