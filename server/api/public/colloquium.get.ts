import { getPublicColloquium } from '../../services/public-content.service'
import { preparePublicResponse } from '../../utils/public-api'

export default defineEventHandler((event) => {
  preparePublicResponse(event)
  return getPublicColloquium(event)
})
