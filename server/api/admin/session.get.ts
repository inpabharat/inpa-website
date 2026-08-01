import { createError } from 'h3'

export default defineEventHandler((event) => {
  if (!event.context.editor) {
    throw createError({ statusCode: 403, statusMessage: 'Editor access is not available.' })
  }

  return {
    data: {
      email: event.context.editor.email,
      source: event.context.editor.source,
    },
  }
})
