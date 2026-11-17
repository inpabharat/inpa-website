import { createError, setResponseStatus } from 'h3'
import { CandidateValidationError, parseCandidateSubmission } from '../../../../shared/utils/candidate-validation'
import { limitCandidateRequests, protectCandidateResponse, readCandidateJson, withCandidates } from '../../../utils/candidates-api'

export default defineEventHandler(async (event) => {
  protectCandidateResponse(event)
  await limitCandidateRequests(event, 'submit')
  const input = await readCandidateJson(event)
  setResponseStatus(event, 202)
  if (input.website) return { accepted: true }

  try {
    const { profile, email } = parseCandidateSubmission(input)
    await withCandidates(event, repository => repository.submit(profile, email, new Date().toISOString()))
    return { accepted: true }
  } catch (error) {
    if (error instanceof CandidateValidationError) {
      throw createError({ statusCode: 422, statusMessage: error.message, data: { issues: error.issues } })
    }
    throw error
  }
})
