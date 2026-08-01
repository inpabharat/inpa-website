import { getPublicCarousel } from '../../services/public-content.service'
import { preparePublicResponse } from '../../utils/public-api'

export default defineEventHandler(async (event) => {
  preparePublicResponse(event)
  return getPublicCarousel(event)
})
