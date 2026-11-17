export const candidateStages = [
  { value: 'phd-near-completion', label: 'PhD nearing completion' },
  { value: 'phd-completed', label: 'PhD completed' },
  { value: 'postdoctoral', label: 'Postdoctoral experience' },
] as const

export const candidateRoles = [
  { value: 'postdoctoral', label: 'Postdoctoral positions' },
  { value: 'faculty', label: 'Assistant professor and faculty roles' },
  { value: 'research', label: 'Research scientist and fellowship roles' },
] as const

export type CandidateStage = typeof candidateStages[number]['value']
export type CandidateRole = typeof candidateRoles[number]['value']

export interface CandidateProfile {
  name: string
  affiliation: string | null
  stage: CandidateStage
  roles: CandidateRole[]
  research: string
  availability: string | null
  summary: string
  cvUrl: string
}

export interface CandidateDirectory {
  profiles: CandidateProfile[]
  hasNext: boolean
}

export type CandidateStatus = 'unverified' | 'review' | 'published' | 'expired'

export interface CandidateState {
  profile: CandidateProfile
  status: CandidateStatus
  expiresAt: string | null
  renewalRequested: boolean
  canRequestRenewal: boolean
}

export interface CandidateReview extends CandidateState {
  id: string
  email: string
  createdAt: string
  linkIssued: boolean
}

export const candidateRetention = {
  linkDays: 3,
  unverifiedDays: 14,
  reviewDays: 30,
  listingDays: 90,
  renewalWindowDays: 30,
} as const

export const candidateLimits = {
  name: 100,
  affiliation: 130,
  research: 160,
  availability: 80,
  summary: 600,
  cvUrl: 500,
  email: 254,
} as const
