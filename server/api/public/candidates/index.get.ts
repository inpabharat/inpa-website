import { getQuery } from 'h3'
import { candidateRoleFilter } from '../../../../shared/utils/candidate-validation'
import { candidatePage, limitCandidateRequests, protectCandidateResponse, withCandidates } from '../../../utils/candidates-api'

export default defineEventHandler(async (event) => {
  protectCandidateResponse(event)
  await limitCandidateRequests(event, 'browse')
  const query = getQuery(event)
  const search = typeof query.q === 'string' ? query.q.trim().slice(0, 100) : ''
  return withCandidates(event, repository =>
    repository.directory(new Date().toISOString(), candidatePage(query.page), search, candidateRoleFilter(query.role)))
})
