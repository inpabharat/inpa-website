import type { H3Event } from 'h3'
import { createError, getHeader, getRequestURL, readBody, setResponseHeader } from 'h3'
import type { InpaDatabase } from '../database/client'
import { useDatabase } from '../database/client'
import { ContentValidationError } from '../../shared/utils/content-validation'

export function prepareAdminResponse(event: H3Event): void {
  setResponseHeader(event, 'Cache-Control', 'private, no-store, max-age=0')
  setResponseHeader(event, 'Pragma', 'no-cache')
}

export function requireAdminDatabase(event: H3Event): InpaDatabase {
  const database = useDatabase(event)
  if (!database) {
    throw createError({ statusCode: 503, statusMessage: 'The content database is not available in this environment.' })
  }
  return database
}

export function requireAdminIdentity(event: H3Event): string {
  const identity = event.context.editor?.email
  if (!identity) throw createError({ statusCode: 403, statusMessage: 'Editor access is not available.' })
  return identity
}

export function assertSameOrigin(event: H3Event): void {
  const origin = getHeader(event, 'origin')
  if (!origin) return
  if (origin !== getRequestURL(event).origin) {
    throw createError({ statusCode: 403, statusMessage: 'Cross-site administrative requests are not allowed.' })
  }
}

export async function readAdminJson(event: H3Event): Promise<unknown> {
  assertSameOrigin(event)
  const contentType = getHeader(event, 'content-type') ?? ''
  if (!contentType.toLowerCase().startsWith('application/json')) {
    throw createError({ statusCode: 415, statusMessage: 'Administrative requests must use JSON.' })
  }
  return readBody(event)
}

export function validationError(error: unknown): never {
  if (error instanceof ContentValidationError) {
    throw createError({
      statusCode: 422,
      statusMessage: error.message,
      data: { issues: error.issues },
    })
  }
  const message = error instanceof Error ? error.message : ''
  if (message.includes('UNIQUE constraint failed')) {
    throw createError({ statusCode: 409, statusMessage: 'That slug is already in use.' })
  }
  throw error
}

export function adminResponse<T>(data: T, message?: string) {
  return {
    data,
    ...(message ? { message } : {}),
    meta: { generatedAt: new Date().toISOString() },
  }
}

