import { getRequestURL } from 'h3'
import { requireEditor } from '../utils/editor-auth'

function isEditorPath(pathname: string): boolean {
  return pathname === '/admin' || pathname.startsWith('/admin/') || pathname.startsWith('/api/admin/')
}

export default defineEventHandler(async (event) => {
  if (!isEditorPath(getRequestURL(event).pathname)) return
  event.context.editor = await requireEditor(event)
})
