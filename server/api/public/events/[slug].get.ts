import { createError, getRouterParam } from 'h3'
import { getPublishedEventBySlug } from '../../../services/public-content.service'
import { preparePublicResponse } from '../../../utils/public-api'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'An event slug is required.' })
  preparePublicResponse(event)
  return getPublishedEventBySlug(event, slug)
})
