import { createError, getRouterParam, setResponseHeader } from 'h3'
import { getR2Binding } from '../../database/bindings'

export default defineEventHandler(async (event) => {
  const bucket = getR2Binding(event)
  if (!bucket) throw createError({ statusCode: 404, statusMessage: 'Media not found.' })
  const rawKey = getRouterParam(event, 'key') ?? ''
  const key = decodeURIComponent(rawKey)
  if (!/^uploads\/\d{4}\/\d{2}\/[0-9a-f-]+\.(?:jpg|png|webp|pdf)$/i.test(key)) {
    throw createError({ statusCode: 404, statusMessage: 'Media not found.' })
  }
  const object = await bucket.get(key)
  if (!object) throw createError({ statusCode: 404, statusMessage: 'Media not found.' })

  setResponseHeader(event, 'Content-Type', object.httpMetadata?.contentType ?? 'application/octet-stream')
  setResponseHeader(event, 'Cache-Control', object.httpMetadata?.cacheControl ?? 'public, max-age=31536000, immutable')
  setResponseHeader(event, 'ETag', object.httpEtag)
  setResponseHeader(event, 'X-Content-Type-Options', 'nosniff')
  if (object.httpMetadata?.contentType === 'application/pdf') {
    setResponseHeader(event, 'Content-Disposition', 'inline')
  }
  return object.body
})
