type CandidateRequestError = { data?: { statusMessage?: string, data?: { issues?: Record<string, string> } } }

export function candidateFieldIssues(error: unknown): Record<string, string> | undefined {
  return (error as CandidateRequestError | null)?.data?.data?.issues
}

export function candidateError(error: unknown, fallback: string): string {
  const failure = error as CandidateRequestError | null
  const issues = candidateFieldIssues(error)
  return issues ? Object.values(issues).join(' ') : (failure?.data?.statusMessage || fallback)
}
