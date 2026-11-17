// Remove a path from this list when its page is ready to publish.
const hiddenPublicPaths = new Set(['/students', '/students/opportunities', '/people', '/awards'])

export function isPublicPathVisible(path: string): boolean {
  return !hiddenPublicPaths.has(path)
}
