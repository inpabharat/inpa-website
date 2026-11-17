import { createError, getRequestURL, getRouterParam } from 'h3'
import { requireAdminIdentity } from '../../../utils/admin-api'
import { hashCandidateToken, newCandidateToken, protectCandidateResponse, readCandidateJson, withCandidates } from '../../../utils/candidates-api'

export default defineEventHandler(async (event) => {
  protectCandidateResponse(event)
  requireAdminIdentity(event)
  const id = getRouterParam(event, 'id') ?? ''
  const { action, reviewed } = await readCandidateJson(event)
  const now = new Date().toISOString()
  return withCandidates(event, async (repository) => {
    if (action === 'link') {
      const token = newCandidateToken()
      const record = await repository.issueLink(id, await hashCandidateToken(token), now)
      if (!record) throw createError({ statusCode: 404, statusMessage: 'This submission is no longer available.' })
      const url = new URL('/jobs/manage', getRequestURL(event).origin)
      url.hash = token
      return { email: record.email, link: url.href, verified: Boolean(record.verified) }
    }
    if (action === 'publish' && reviewed === true) {
      if (!await repository.publish(id, now)) {
        throw createError({ statusCode: 409, statusMessage: 'The listing needs a verified email and a pending review before publication.' })
      }
      return { message: 'The listing is published for 90 days.' }
    }
    if (action === 'remove') {
      await repository.remove(id)
      return { message: 'The listing was removed.' }
    }
    throw createError({ statusCode: 422, statusMessage: 'Select a review action and confirm the public details before publishing.' })
  })
})
