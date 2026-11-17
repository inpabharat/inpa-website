export function candidateError(error: unknown, fallback: string): string {
  const failure = error as { data?: { statusMessage?: string, data?: { issues?: Record<string, string> } } } | null
  const issues = failure?.data?.data?.issues
  return issues ? Object.values(issues).join(' ') : (failure?.data?.statusMessage || fallback)
}
