import type { H3Event } from 'h3'
import { createError } from 'h3'
import type { MediaKind } from '../../shared/types/media'
import { getR2Binding } from '../database/bindings'

export async function requireUploadedMedia(event: H3Event, key: string, kind: MediaKind, field: string): Promise<void> {
  if (!/^uploads\/\d{4}\/\d{2}\/[0-9a-f-]+\.(jpg|png|webp|pdf)$/i.test(key)) {
    const message = 'Choose a file from the media library.'
    throw createError({ statusCode: 422, statusMessage: message, data: { fieldIssues: { [field]: message } } })
  }
  const object = await getR2Binding(event)?.head(key)
  const contentType = object?.httpMetadata?.contentType
  const matches = kind === 'pdf' ? contentType === 'application/pdf' : contentType?.startsWith('image/')
  if (!matches) {
    const message = `The selected ${kind} is unavailable. Please choose another file.`
    throw createError({ statusCode: 422, statusMessage: message, data: { fieldIssues: { [field]: message } } })
  }
}
