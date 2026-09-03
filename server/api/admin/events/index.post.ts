import { createAdminContent } from '../../../services/admin-content.service'

export default defineEventHandler(event => createAdminContent(event, 'events'))

