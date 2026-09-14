import { publicScience } from '../../../services/science.service'
export default defineEventHandler(event => publicScience(event, 'research'))
