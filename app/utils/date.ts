export function formatIndiaDate(value: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(value))
}

export function formatIssueMonth(value: string): string {
  return new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' }).format(new Date(value))
}

export function formatEventDate(value: string, timeZone = 'Asia/Kolkata'): string {
  const aliases: Record<string, string> = {
    Brussels: 'Europe/Brussels',
    Kolkata: 'Asia/Kolkata',
    Mumbai: 'Asia/Kolkata',
    Delhi: 'Asia/Kolkata',
  }
  const resolvedTimeZone = aliases[timeZone] ?? timeZone
  try {
    return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: resolvedTimeZone }).format(new Date(value))
  } catch {
    return `${formatIndiaDate(value)} (timezone: ${timeZone})`
  }
}
