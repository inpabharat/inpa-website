import { createError } from 'h3'
import { hashCandidateToken, limitCandidateRequests, protectCandidateResponse, readCandidateJson, withCandidates } from '../../../utils/candidates-api'

export default defineEventHandler(async (event) => {
  protectCandidateResponse(event)
  await limitCandidateRequests(event, 'manage')
  const { token, action } = await readCandidateJson(event)
  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token) || typeof action !== 'string' || !['view', 'verify', 'renew', 'withdraw'].includes(action)) {
    throw createError({ statusCode: 400, statusMessage: 'Open the private link from INPA to manage your listing.' })
  }
  const hash = await hashCandidateToken(token)
  const now = new Date().toISOString()
  const invalidLink = () => createError({ statusCode: 404, statusMessage: 'This link has expired or been replaced. Contact INPA for a new link.' })
  return withCandidates(event, async (repository) => {
    if (action === 'withdraw') {
      if (!await repository.withdraw(hash, now)) throw invalidLink()
      return { removed: true }
    }
    if (action === 'verify') await repository.verify(hash, now)
    if (action === 'renew') await repository.renew(hash, now)
    const state = await repository.manage(hash, now)
    if (!state) throw invalidLink()
    return state
  })
})
