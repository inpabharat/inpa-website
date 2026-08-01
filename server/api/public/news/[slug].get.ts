import { createError, getRouterParam } from 'h3'
import { getPublishedNewsBySlug } from '../../../services/public-content.service'
import { preparePublicResponse } from '../../../utils/public-api'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'A news slug is required.' })
  preparePublicResponse(event)
  return getPublishedNewsBySlug(event, slug)
})
