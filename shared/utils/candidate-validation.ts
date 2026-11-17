import { candidateLimits, candidateRoles, candidateStages } from '../types/candidates'
import type { CandidateProfile, CandidateRole } from '../types/candidates'

const emails = /[^\s@]+@[^\s@]+\.[^\s@]+/
const emailAddress = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i

export class CandidateValidationError extends Error {
  constructor(public readonly issues: Record<string, string>) {
    super('Check the marked fields.')
  }
}

function getCvUrl(value: string): string | null {
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return null
    if (!url.hostname.includes('.') || /^[\d.]+$/.test(url.hostname) || /\.(?:local|localhost|internal)\.?$/i.test(url.hostname)) return null
    return url.href.length <= candidateLimits.cvUrl ? url.href : null
  } catch {
    return null
  }
}

export function parseCandidateSubmission(value: unknown): { profile: CandidateProfile, email: string } {
  const input = (value && typeof value === 'object' && !Array.isArray(value) ? value : {}) as Record<string, unknown>
  const issues: Record<string, string> = {}

  function readText(key: keyof typeof candidateLimits, label: string, required = true): string {
    const raw = input[key]
    const value = typeof raw === 'string' ? raw.trim() : ''
    if (!value && required) issues[key] = `Enter ${label}.`
    else if (value.length > candidateLimits[key]) issues[key] = `Use ${candidateLimits[key]} characters or fewer.`
    else if (key !== 'email' && key !== 'cvUrl' && (emails.test(value) || /https?:\/\//i.test(value))) issues[key] = 'Keep contact details and links out of this field.'
    return value
  }

  const name = readText('name', 'your name')
  const affiliation = readText('affiliation', 'your affiliation', false) || null
  const research = readText('research', 'your research areas')
  const availability = readText('availability', 'your availability', false) || null
  const summary = readText('summary', 'a short research summary')
  const rawUrl = readText('cvUrl', 'the link to your public CV')
  const cvUrl = getCvUrl(rawUrl)
  if (!issues.cvUrl && !cvUrl) issues.cvUrl = 'Enter a public HTTPS link to your CV.'
  const email = readText('email', 'your verification email').toLowerCase()
  if (!issues.email && !emailAddress.test(email)) issues.email = 'Enter a valid email address.'
  if (email && cvUrl) {
    try {
      if (decodeURIComponent(cvUrl).toLowerCase().includes(email)) issues.cvUrl = 'Use a CV link that keeps your verification address private.'
    } catch {
      issues.cvUrl = 'Enter a valid HTTPS link to your CV.'
    }
  }

  const stage = candidateStages.find(option => option.value === input.stage)?.value
  if (!stage) issues.stage = 'Select your career stage.'
  const roles = candidateRoles.filter(option => Array.isArray(input.roles) && input.roles.includes(option.value)).map(option => option.value)
  if (!roles.length || !Array.isArray(input.roles) || roles.length !== input.roles.length) issues.roles = 'Select one or more roles from the list.'
  if (input.consent !== true) issues.consent = 'Confirm that you agree to public listing.'

  if (Object.keys(issues).length || !stage || !cvUrl) throw new CandidateValidationError(issues)
  return { profile: { name, affiliation, stage, roles, research, availability, summary, cvUrl }, email }
}

export function candidateRoleFilter(value: unknown): CandidateRole | undefined {
  return candidateRoles.find(role => role.value === value)?.value
}
