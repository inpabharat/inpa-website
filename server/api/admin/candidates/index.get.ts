import { getQuery } from 'h3'
import { requireAdminIdentity } from '../../../utils/admin-api'
import { candidatePage, protectCandidateResponse, withCandidates } from '../../../utils/candidates-api'

export default defineEventHandler((event) => {
  protectCandidateResponse(event)
  requireAdminIdentity(event)
  return withCandidates(event, repository =>
    repository.reviewQueue(new Date().toISOString(), candidatePage(getQuery(event).page)))
})
