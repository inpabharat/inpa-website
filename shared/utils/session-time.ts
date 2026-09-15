export function formatSessionTime(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds))
  const days = Math.floor(safeSeconds / 86_400)
  const hours = Math.floor((safeSeconds % 86_400) / 3_600)
  const minutes = Math.floor((safeSeconds % 3_600) / 60)
  const seconds = safeSeconds % 60
  const clock = [hours, minutes, seconds].map(value => String(value).padStart(2, '0')).join(':')
  return days > 0 ? `${days}d ${clock}` : clock
}
