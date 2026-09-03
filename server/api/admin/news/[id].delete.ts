import { createError, getRouterParam } from 'h3'
import { deleteAdminContent } from '../../../services/admin-content.service'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'A content ID is required.' })
  return deleteAdminContent(event, 'news', id)
})

