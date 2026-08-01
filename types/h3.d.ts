import type { CloudflareBindings } from '../server/database/bindings'
import type { EditorIdentity } from '../server/utils/editor-auth'

declare module 'h3' {
  interface H3EventContext {
    cloudflare?: {
      env?: CloudflareBindings
      context?: ExecutionContext
    }
    editor?: EditorIdentity
  }
}

export {}
