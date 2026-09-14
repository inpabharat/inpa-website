import type { H3Event } from 'h3'
import { createError, getRouterParam, setResponseHeader } from 'h3'
import { parsePublicationInput, parseResearchInput, ScienceValidationError } from '../../shared/utils/science-validation'
import { ScienceRepository, staticPublicationMedia } from '../repositories/science.repository'
import { getR2Binding } from '../database/bindings'
import { adminResponse, assertSameOrigin, prepareAdminResponse, readAdminJson, requireAdminDatabase, requireAdminIdentity, validationError } from '../utils/admin-api'

type Kind = 'publications' | 'research'
function repository(event: H3Event) { return new ScienceRepository(requireAdminDatabase(event)) }
async function checkMedia(event: H3Event, key: string | null, type: 'image' | 'pdf'): Promise<void> {
  if (!key) return
  const known = staticPublicationMedia.get(key as Parameters<typeof staticPublicationMedia.get>[0])
  if (known && (type === 'pdf' ? known === 'application/pdf' : known.startsWith('image/'))) return
  if (!/^uploads\/\d{4}\/\d{2}\/[0-9a-f-]+\.(jpg|png|webp|pdf)$/i.test(key)) throw createError({ statusCode: 422, statusMessage: 'Choose a file from the media library.' })
  const object = await getR2Binding(event)?.head(key)
  if (!object || !(type === 'pdf' ? object.httpMetadata?.contentType === 'application/pdf' : object.httpMetadata?.contentType?.startsWith('image/'))) throw createError({ statusCode: 422, statusMessage: `The selected ${type} is unavailable. Please choose another file.` })
}
export async function adminScience(event: H3Event, kind: Kind, method: 'GET' | 'POST' | 'PUT' | 'DELETE') {
  prepareAdminResponse(event)
  const editor = requireAdminIdentity(event)
  const store = repository(event)
  const id = getRouterParam(event, 'id') ?? ''
  try {
    if (method === 'GET') return adminResponse(kind === 'publications' ? await store.listPublications() : await store.listResearch())
    assertSameOrigin(event)
    if (method === 'DELETE') {
      const removed = kind === 'publications' ? await store.deletePublication(id, editor) : await store.deleteResearch(id, editor)
      if (!removed) throw createError({ statusCode: 404, statusMessage: 'Item not found.' })
      return adminResponse({ id }, 'Item removed.')
    }
    const body = await readAdminJson(event)
    let saved
    if (kind === 'publications') {
      const input = parsePublicationInput(body)
      await checkMedia(event, input.pdfKey, 'pdf')
      await checkMedia(event, input.coverImageKey, 'image')
      saved = method === 'POST' ? await store.createPublication(input, editor) : await store.updatePublication(id, input, editor)
    } else {
      const input = parseResearchInput(body)
      await checkMedia(event, input.imageKey, 'image')
      saved = method === 'POST' ? await store.createResearch(input, editor) : await store.updateResearch(id, input, editor)
    }
    if (!saved) throw createError({ statusCode: 404, statusMessage: 'Item not found.' })
    return adminResponse(saved, 'Changes saved.')
  } catch (error) {
    if (error instanceof ScienceValidationError) throw createError({ statusCode: 422, statusMessage: error.message, data: { issues: error.issues } })
    validationError(error)
  }
}
export async function publicScience(event: H3Event, kind: Kind, slug?: string) {
  setResponseHeader(event, 'Cache-Control', 'public, max-age=0, s-maxage=60, must-revalidate')
  const store = repository(event)
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
  const data = kind === 'publications' ? await store.listPublishedPublications(today) : slug ? await store.getPublishedResearchBySlug(slug, today) : await store.listPublishedResearch(today)
  if (slug && !data) throw createError({ statusCode: 404, statusMessage: 'Research feature not found.' })
  return { data }
}
