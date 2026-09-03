import { createError, readMultipartFormData } from 'h3'
import { getR2Binding } from '../../../database/bindings'
import { AdminContentRepository } from '../../../repositories/admin-content.repository'
import { assertSameOrigin, prepareAdminResponse, requireAdminDatabase, requireAdminIdentity } from '../../../utils/admin-api'

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024
const allowedFiles = {
  'image/jpeg': { extension: 'jpg', extensions: ['jpg', 'jpeg'], signature: (data: Uint8Array) => data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff },
  'image/png': { extension: 'png', extensions: ['png'], signature: (data: Uint8Array) => data.length >= 8 && data.slice(0, 8).every((byte, index) => byte === [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a][index]) },
  'image/webp': { extension: 'webp', extensions: ['webp'], signature: (data: Uint8Array) => data.length >= 12 && new TextDecoder().decode(data.slice(0, 4)) === 'RIFF' && new TextDecoder().decode(data.slice(8, 12)) === 'WEBP' },
  'application/pdf': { extension: 'pdf', extensions: ['pdf'], signature: (data: Uint8Array) => data.length >= 5 && new TextDecoder().decode(data.slice(0, 5)) === '%PDF-' },
} as const

export default defineEventHandler(async (event) => {
  prepareAdminResponse(event)
  assertSameOrigin(event)
  const editor = requireAdminIdentity(event)
  const bucket = getR2Binding(event)
  if (!bucket) throw createError({ statusCode: 503, statusMessage: 'Media storage is not available in this environment.' })

  const parts = await readMultipartFormData(event)
  const file = parts?.find(part => part.name === 'file' && part.filename)
  const alt = parts?.find(part => part.name === 'alt')?.data.toString().trim() ?? ''
  const credit = parts?.find(part => part.name === 'credit')?.data.toString().trim() ?? ''
  const licence = parts?.find(part => part.name === 'licence')?.data.toString().trim() ?? ''
  if (!file?.type || !file.data.length) throw createError({ statusCode: 422, statusMessage: 'Choose an image or PDF to upload.' })
  if (file.data.length > MAX_UPLOAD_BYTES) throw createError({ statusCode: 413, statusMessage: 'Uploads are limited to 8 MB.' })

  const allowed = allowedFiles[file.type as keyof typeof allowedFiles]
  const suppliedExtension = file.filename?.split('.').pop()?.toLowerCase() ?? ''
  if (!allowed || !allowed.extensions.includes(suppliedExtension as never) || !allowed.signature(file.data)) {
    throw createError({ statusCode: 415, statusMessage: 'Only genuine JPEG, PNG, WebP, and PDF files are accepted.' })
  }
  if (file.type.startsWith('image/') && !alt) {
    throw createError({ statusCode: 422, statusMessage: 'Alternative text is required for meaningful images.' })
  }

  const now = new Date()
  const key = `uploads/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, '0')}/${crypto.randomUUID()}.${allowed.extension}`
  const metadata = {
    alt,
    credit,
    licence,
    uploadedBy: editor,
    uploadedAt: now.toISOString(),
  }
  await bucket.put(key, file.data, {
    httpMetadata: { contentType: file.type, cacheControl: 'public, max-age=31536000, immutable' },
    customMetadata: metadata,
  })
  try {
    await new AdminContentRepository(requireAdminDatabase(event)).recordMediaCreation(key, editor, { key, size: file.data.length, contentType: file.type, ...metadata })
  } catch (error) {
    await bucket.delete(key)
    throw error
  }

  return {
    data: { key, url: `/media/${key}`, alt, credit, licence, size: file.data.length, contentType: file.type },
    message: 'Media uploaded.',
    meta: { generatedAt: now.toISOString() },
  }
})
