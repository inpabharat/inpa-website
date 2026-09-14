import { createError } from 'h3'
import { getR2Binding } from '../../../database/bindings'
import { prepareAdminResponse, requireAdminIdentity, requireAdminDatabase } from '../../../utils/admin-api'
import { AdminContentRepository } from '../../../repositories/admin-content.repository'
import { ScienceRepository } from '../../../repositories/science.repository'

export default defineEventHandler(async (event) => {
  prepareAdminResponse(event)
  requireAdminIdentity(event)
  const bucket = getR2Binding(event)
  if (!bucket) throw createError({ statusCode: 503, statusMessage: 'Media storage is not available in this environment.' })
  const result = await bucket.list({ prefix: 'uploads/', limit: 500, include: ['httpMetadata', 'customMetadata'] })
  const database = requireAdminDatabase(event)
  const science = new ScienceRepository(database)
  const [snapshot, issues, research] = await Promise.all([new AdminContentRepository(database).snapshot(), science.listPublications(), science.listResearch()])
  const references = [
    ...snapshot.news.map(item => ({ key: item.coverImageKey, kind: 'news', id: item.id, title: item.title, status: item.status })),
    ...snapshot.events.map(item => ({ key: item.coverImageKey, kind: 'event', id: item.id, title: item.title, status: item.status })),
    ...snapshot.carousel.map(item => ({ key: item.imageKey, kind: 'homepage slide', id: item.id, title: item.title, status: item.isActive ? 'active' : 'inactive' })),
    ...issues.flatMap(item => [item.pdfKey, item.coverImageKey].map(key => ({ key, kind: 'publication', id: item.id, title: item.issueLabel, status: item.status }))),
    ...research.map(item => ({ key: item.imageKey, kind: 'research', id: item.id, title: item.title, status: item.status })),
  ]
  return {
    data: result.objects.map(object => ({
      key: object.key,
      originalName: object.customMetadata?.originalName ?? '',
      usages: references.filter(item => item.key === object.key).map(({ key: _key, ...usage }) => usage),
      url: `/media/${object.key}`,
      size: object.size,
      uploadedAt: object.uploaded.toISOString(),
      contentType: object.httpMetadata?.contentType ?? 'application/octet-stream',
      alt: object.customMetadata?.alt ?? '',
      credit: object.customMetadata?.credit ?? '',
      licence: object.customMetadata?.licence ?? '',
    })),
    meta: { generatedAt: new Date().toISOString(), truncated: result.truncated },
  }
})
