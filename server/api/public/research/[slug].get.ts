import { getRouterParam } from 'h3'
import { publicScience } from '../../../services/science.service'
export default defineEventHandler(event => publicScience(event, 'research', getRouterParam(event, 'slug')))
