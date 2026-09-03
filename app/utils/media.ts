export function publicMediaUrl(key: string | null | undefined): string | null {
  if (!key) return null
  if (key.startsWith('/') || /^https?:\/\//.test(key)) return key
  return `/media/${key.split('/').map(encodeURIComponent).join('/')}`
}
