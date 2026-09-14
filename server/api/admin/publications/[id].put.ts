import { adminScience } from '../../../services/science.service'
export default defineEventHandler(event => adminScience(event, 'publications', 'PUT'))
