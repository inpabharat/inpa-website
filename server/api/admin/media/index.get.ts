import { createError } from 'h3'
import { getR2Binding } from '../../../database/bindings'
import { prepareAdminResponse, requireAdminIdentity } from '../../../utils/admin-api'

export default defineEventHandler(async (event) => {
  prepareAdminResponse(event)
  requireAdminIdentity(event)
  const bucket = getR2Binding(event)
  if (!bucket) throw createError({ statusCode: 503, statusMessage: 'Media storage is not available in this environment.' })
  const result = await bucket.list({ prefix: 'uploads/', limit: 500, include: ['httpMetadata', 'customMetadata'] })
  return {
    data: result.objects.map(object => ({
      key: object.key,
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

