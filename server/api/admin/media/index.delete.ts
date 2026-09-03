import { createError, getQuery } from 'h3'
import { getR2Binding } from '../../../database/bindings'
import { AdminContentRepository } from '../../../repositories/admin-content.repository'
import { assertSameOrigin, prepareAdminResponse, requireAdminDatabase, requireAdminIdentity } from '../../../utils/admin-api'

export default defineEventHandler(async (event) => {
  prepareAdminResponse(event)
  assertSameOrigin(event)
  const editor = requireAdminIdentity(event)
  const key = getQuery(event).key
  if (typeof key !== 'string' || !/^uploads\/\d{4}\/\d{2}\/[0-9a-f-]+\.(?:jpg|png|webp|pdf)$/i.test(key)) {
    throw createError({ statusCode: 400, statusMessage: 'A valid media key is required.' })
  }
  const bucket = getR2Binding(event)
  if (!bucket) throw createError({ statusCode: 503, statusMessage: 'Media storage is not available in this environment.' })
  const object = await bucket.head(key)
  if (!object) throw createError({ statusCode: 404, statusMessage: 'Media object not found.' })
  const repository = new AdminContentRepository(requireAdminDatabase(event))
  if (await repository.mediaReferenceCount(key) > 0) {
    throw createError({ statusCode: 409, statusMessage: 'This media object is still used by published or draft content.' })
  }
  await bucket.delete(key)
  await repository.recordMediaDeletion(key, editor, { key, size: object.size, uploaded: object.uploaded.toISOString(), customMetadata: object.customMetadata })
  return { data: { key }, message: 'Unused media deleted.', meta: { generatedAt: new Date().toISOString() } }
})
