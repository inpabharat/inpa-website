export function toDateTimeLocal(value: string | null): string | null {
  if (!value) return null
  const date = new Date(value)
  if (!Number.isFinite(date.getTime())) return null
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return local.toISOString().slice(0, 16)
}

export function localDateTimeToIso(value: string | null): string | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}T/.test(value)) return null
  const time = normaliseEditorTime(value.slice(11))
  if (!time) return null
  const local = `${value.slice(0, 10)}T${time}`
  const date = new Date(local)
  if (toDateTimeLocal(local) !== local) return null
  return date.toISOString()
}

export function normaliseEditorTime(value: string): string | null {
  const match = /^(\d{1,2}):?(\d{2})$/.exec(value.trim())
  if (!match || Number(match[1]) > 23 || Number(match[2]) > 59) return null
  return `${match[1]!.padStart(2, '0')}:${match[2]}`
}

export function minimumEndDate(start: string | null): string | undefined {
  const local = toDateTimeLocal(localDateTimeToIso(start))
  if (!local) return undefined
  if (!local.endsWith('T23:59')) return local.slice(0, 10)
  const date = new Date(`${local.slice(0, 10)}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + 1)
  return date.toISOString().slice(0, 10)
}

export function editorTimeOptions(date: string, start: string | null): string[] {
  if (!date || date < (minimumEndDate(start) ?? '')) return []
  let firstMinute = 0
  const local = toDateTimeLocal(localDateTimeToIso(start))
  if (local?.startsWith(`${date}T`)) {
    firstMinute = Number(local.slice(11, 13)) * 60 + Number(local.slice(14, 16)) + 1
  }
  const times = []
  for (let minute = firstMinute; minute < 24 * 60; minute += 15 - minute % 15) {
    const time = `${String(Math.floor(minute / 60)).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')}`
    if (localDateTimeToIso(`${date}T${time}`)) times.push(time)
  }
  return times
}

export function localCalendarDate(date = new Date()): string {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return local.toISOString().slice(0, 10)
}
