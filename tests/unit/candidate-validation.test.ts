import { describe, expect, it } from 'vitest'
import { CandidateValidationError, parseCandidateSubmission } from '../../shared/utils/candidate-validation'

const submission = {
  name: 'Test Researcher',
  affiliation: '',
  stage: 'postdoctoral',
  roles: ['faculty', 'postdoctoral'],
  research: 'Nuclear structure',
  availability: '',
  summary: 'Studies gamma-ray spectroscopy and high-spin states.',
  cvUrl: 'https://example.com/researcher/cv.pdf',
  email: ' Researcher@example.com ',
  consent: true,
}

describe('academic candidate submissions', () => {
  it('normalises the profile and separates the private email from the public fields', () => {
    const { email, profile } = parseCandidateSubmission(submission)
    expect(email).toBe('researcher@example.com')
    expect(profile).not.toHaveProperty('email')
    expect(profile.affiliation).toBeNull()
    expect(profile.roles).toEqual(['postdoctoral', 'faculty'])
  })

  it('requires consent and recognised roles, and rejects contact details in the public copy', () => {
    expect(() => parseCandidateSubmission({
      ...submission, consent: false, roles: ['unknown'], summary: 'Contact researcher@example.com.',
    })).toThrow(CandidateValidationError)
  })

  it.each([
    'javascript:alert(1)',
    'http://example.com/cv.pdf',
    'https://example.com@untrusted.example.org/cv.pdf',
    'https://127.0.0.1/cv.pdf',
    'https://example.com/researcher%40example.com/cv.pdf',
  ])('rejects unsafe or private CV links (%s)', cvUrl => {
    expect(() => parseCandidateSubmission({ ...submission, cvUrl })).toThrow(CandidateValidationError)
  })
})
