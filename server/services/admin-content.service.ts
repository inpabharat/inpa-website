import type { H3Event } from 'h3'
import { createError } from 'h3'
import { parseCarouselInput, parseEventInput, parseNewsInput } from '../../shared/utils/content-validation'
import { AdminContentRepository } from '../repositories/admin-content.repository'
import { adminResponse, assertSameOrigin, prepareAdminResponse, readAdminJson, requireAdminDatabase, requireAdminIdentity, validationError } from '../utils/admin-api'

type ContentKind = 'news' | 'events' | 'carousel'

function repository(event: H3Event) {
  prepareAdminResponse(event)
  return new AdminContentRepository(requireAdminDatabase(event))
}

export async function getAdminSnapshot(event: H3Event) {
  requireAdminIdentity(event)
  return adminResponse(await repository(event).snapshot())
}

export async function createAdminContent(event: H3Event, kind: ContentKind) {
  const editor = requireAdminIdentity(event)
  const body = await readAdminJson(event)
  const store = repository(event)
  try {
    if (kind === 'news') return adminResponse(await store.createNews(parseNewsInput(body), editor), 'News item created.')
    if (kind === 'events') return adminResponse(await store.createEvent(parseEventInput(body), editor), 'Event created.')
    return adminResponse(await store.createCarousel(parseCarouselInput(body), editor), 'Carousel item created.')
  } catch (error) {
    validationError(error)
  }
}

export async function updateAdminContent(event: H3Event, kind: ContentKind, id: string) {
  const editor = requireAdminIdentity(event)
  const body = await readAdminJson(event)
  const store = repository(event)
  try {
    const updated = kind === 'news'
      ? await store.updateNews(id, parseNewsInput(body), editor)
      : kind === 'events'
        ? await store.updateEvent(id, parseEventInput(body), editor)
        : await store.updateCarousel(id, parseCarouselInput(body), editor)
    if (!updated) throw createError({ statusCode: 404, statusMessage: 'Content item not found.' })
    return adminResponse(updated, 'Changes saved.')
  } catch (error) {
    validationError(error)
  }
}

export async function deleteAdminContent(event: H3Event, kind: ContentKind, id: string) {
  const editor = requireAdminIdentity(event)
  assertSameOrigin(event)
  const store = repository(event)
  const deleted = kind === 'news'
    ? await store.deleteNews(id, editor)
    : kind === 'events'
      ? await store.deleteEvent(id, editor)
      : await store.deleteCarousel(id, editor)
  if (!deleted) throw createError({ statusCode: 404, statusMessage: 'Content item not found.' })
  return adminResponse({ id }, 'Content item deleted.')
}
